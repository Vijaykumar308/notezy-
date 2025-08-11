import { connectDB } from '@/lib/dbconn';
import { NextResponse } from 'next/server';
import Tag from '@/models/tagModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Connect to the database
await connectDB();

// GET /api/tags - Get all tags for the authenticated user
export async function GET(request) {
  try {
    console.log('GET /api/tags - Starting request');
    
    const session = await getServerSession(authOptions);
    console.log('Session data:', session);
    
    if (!session?.user?.id) {
      console.error('No session or user ID found');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Not authenticated',
          error: 'No valid session or user ID found' 
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const sort = searchParams.get('sort') || 'usageCount';
    const order = searchParams.get('order') || 'desc';

    // Build query
    console.log('Building query for user ID:', session.user.id);
    const query = {
      $or: [
        { createdBy: session.user.id },
        { isCustom: false } // Include system tags
      ]
    };
    
    console.log('MongoDB query:', JSON.stringify(query, null, 2));

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    console.log('Executing database queries...');
    
    let tags, total;
    try {
      [tags, total] = await Promise.all([
        Tag.find(query)
          .sort(sortObj)
          .skip(skip)
          .limit(limit)
          .select('name color usageCount isCustom')
          .lean(),
        Tag.countDocuments(query)
      ]);
      console.log(`Found ${tags.length} tags out of ${total} total`);
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    return NextResponse.json({
      success: true,
      data: tags,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// POST /api/tags - Create a new tag
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { name, color } = await request.json();

    // Validate input
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Tag name is required' },
        { status: 400 }
      );
    }

    const tagName = name.trim().toLowerCase();
    console.log(`Checking for existing tag with name: ${tagName} for user: ${session.user.id}`);
    
    // Check if tag already exists for this user or is a system tag
    const existingTag = await Tag.findOne({
      name: tagName,
      $or: [
        { createdBy: session.user.id },
        { isCustom: false } // Check against system tags too
      ]
    });

    if (existingTag) {
      console.log('Found existing tag:', {
        _id: existingTag._id,
        name: existingTag.name,
        createdBy: existingTag.createdBy,
        isCustom: existingTag.isCustom
      });
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tag already exists',
          error: 'A tag with this name already exists',
          existingTag: {
            _id: existingTag._id,
            name: existingTag.name,
            isCustom: existingTag.isCustom
          }
        },
        { status: 400 }
      );
    }

    // Create new tag
    console.log('Creating new tag with data:', {
      name: tagName,
      color: color || '#3b82f6',
      createdBy: session.user.id,
      isCustom: true
    });
    
    let tag;
    try {
      tag = await Tag.create({
        name: tagName,
        color: color || '#3b82f6',
        createdBy: session.user.id,
        isCustom: true
      });
      console.log('Successfully created tag:', tag);
    } catch (createError) {
      console.error('Error creating tag:', {
        error: createError,
        errorMessage: createError.message,
        errorCode: createError.code,
        errorName: createError.name,
        errorStack: createError.stack
      });
      throw createError;
    }

    return NextResponse.json(
      { 
        success: true, 
        data: {
          _id: tag._id,
          name: tag.name,
          color: tag.color,
          isCustom: tag.isCustom
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create tag' },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/:id - Delete a tag
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Tag ID is required' },
        { status: 400 }
      );
    }

    // Find the tag
    const tag = await Tag.findById(id);
    
    if (!tag) {
      return NextResponse.json(
        { success: false, message: 'Tag not found' },
        { status: 404 }
      );
    }

    // Check if the tag belongs to the user
    if (tag.createdBy.toString() !== session.user.id && tag.isCustom) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to delete this tag' },
        { status: 403 }
      );
    }

    // Don't allow deleting system tags
    if (!tag.isCustom) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete system tags' },
        { status: 403 }
      );
    }

    // Check if tag is in use
    const Note = (await import('@/models/noteModel')).default;
    const notesUsingTag = await Note.countDocuments({ 
      tags: tag._id,
      createdBy: session.user.id 
    });

    if (notesUsingTag > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cannot delete tag that is in use. Please remove it from all notes first.' 
        },
        { status: 400 }
      );
    }

    // Delete the tag
    await tag.remove();

    return NextResponse.json({
      success: true,
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
