import { connectDB } from '@/lib/dbconn';
import { NextResponse } from 'next/server';
import Note from '@/models/noteModel';
import jwt from 'jsonwebtoken';

// Connect to the database
await connectDB();

// Helper to get user ID from request
async function getUserIdFromRequest(request) {
  try {
    console.log('Checking authorization header...');
    const authHeader = request.headers.get('authorization');
    console.log('Authorization header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      console.log('No authorization header found');
      return null;
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extracted:', token ? 'Token present' : 'No token found');
    
    if (!token) {
      console.log('No token found in authorization header');
      return null;
    }

    console.log('JWT Secret in notes API:', process.env.JWT_SECRET ? 'Present' : 'Missing');
    console.log('Token to verify:', token);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', JSON.stringify(decoded, null, 2));
    
    if (!decoded.userId) {
      console.error('No userId in decoded token');
      return null;
    }
    
    console.log('User ID from token:', decoded.userId);
    return decoded.userId;
  } catch (error) {
    console.error('Error verifying token:', error.message);
    console.error('Token verification error name:', error.name);
    if (error.name === 'JsonWebTokenError') {
      console.error('JWT Error:', error.message);
    } else if (error.name === 'TokenExpiredError') {
      console.error('Token expired at:', error.expiredAt);
    }
    return null;
  }
}

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
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Please log in to view notes' },
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
    const query = { createdBy: userId };
    
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
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Please log in to create notes' },
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
    const note = new Note({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });

    await note.save();

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
