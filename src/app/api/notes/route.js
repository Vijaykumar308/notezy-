import { connectDB } from '@/lib/dbconn';
import { NextResponse } from 'next/server';
import Note from '@/models/noteModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Connect to the database
await connectDB();

// Helper function to handle errors
const handleError = (error, status = 400) => {
  console.error('API Error:', error);
  return NextResponse.json(
    { success: false, message: error.message || 'An error occurred' },
    { status }
  );
};

// GET /api/notes - Get all notes for the authenticated user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tag');
    const isPublic = searchParams.get('public');
    const isArchived = searchParams.get('archived');
    const isPinned = searchParams.get('pinned');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query = { createdBy: session.user.id };
    
    if (tagId) {
      query.tags = tagId;
    }
    
    if (isPublic) {
      query.isPublic = isPublic === 'true';
    }
    
    if (isArchived !== undefined) {
      query.isArchived = isArchived === 'true';
    }
    
    if (isPinned !== undefined) {
      query.isPinned = isPinned === 'true';
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [notes, total] = await Promise.all([
      Note.find(query)
        .populate('tags', 'name color')
        .populate('createdBy', 'name email')
        .sort({ isPinned: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Note.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: notes,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/notes - Create a new note
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Basic validation
    if (!data.title?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      );
    }

    if (!data.content?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      );
    }

    // Create the note with tags
    const note = await Note.createWithTags({
      title: data.title.trim(),
      content: data.content.trim(),
      isPublic: !!data.isPublic,
      isPinned: !!data.isPinned,
      color: data.color || '#ffffff',
      tags: data.tags || []
    }, session.user.id);

    // Populate the created note with related data
    const populatedNote = await Note.findById(note._id)
      .populate('tags', 'name color')
      .populate('createdBy', 'name email');

    return NextResponse.json(
      { success: true, data: populatedNote },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
