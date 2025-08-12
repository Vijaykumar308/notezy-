import { connectDB } from '@/lib/dbconn';
import { NextResponse } from 'next/server';
import Tag from '@/models/tagModel';
import jwt from 'jsonwebtoken';

// Connect to the database
await connectDB();

// Helper function to verify JWT token
async function verifyToken(token) {
  if (!token) return null;
  
  try {
    // Replace 'your-secret-key' with your actual JWT secret from environment variables
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Helper function to get user ID from request
async function getUserIdFromRequest(request) {
  // Try to get from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token);
    if (decoded?.userId) {
      return decoded.userId;
    }
  }
  return null;
}



// GET /api/tags - Get all tags for the authenticated user
export async function GET(request) {
  try {
    console.log('GET /api/tags - Starting request');
    
    const userId = await getUserIdFromRequest(request);
    console.log('User ID from request:', userId);
    
    if (!userId) {
      console.error('No user ID found in session or token');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Not authenticated',
          error: 'No valid authentication token found' 
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
    console.log('Building query for user ID:', userId);
    const query = {
      $or: [
        { createdBy: userId },
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
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
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
    console.log(`Checking for existing tag with name: ${tagName} for user: ${userId}`);
    
    // Check if tag already exists for this user or is a system tag
    const existingTag = await Tag.findOne({
      name: tagName,
      $or: [
        { createdBy: userId },
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
      createdBy: userId,
      isCustom: true
    });
    
    let tag;
    try {
      tag = await Tag.create({
        name: tagName,
        color: color || '#3b82f6',
        createdBy: userId,
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
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
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
    const tag = await Tag.findOne({ _id: id, createdBy: userId });
    
    if (!tag) {
      return NextResponse.json(
        { success: false, message: 'Tag not found' },
        { status: 404 }
      );
    }

    // Check if the tag is in use
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
      createdBy: userId 
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

    // Delete the tag using deleteOne() instead of remove()
    await Tag.deleteOne({ _id: tag._id });

    return NextResponse.json({
      success: true,
      message: 'Tag deleted successfully',
      data: { id: tag._id }
    });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
