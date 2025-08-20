import { connectDB } from '@/lib/dbconn';
import { NextResponse } from 'next/server';
import Note from '@/models/noteModel';
import Tag from '@/models/tagModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Connect to the database and ensure models are registered
await connectDB();

// Ensure models are registered
import '@/models';

// Helper function to check if user is authorized to access/modify the note
async function authorizeNoteAccess(noteId, userId) {
  const note = await Note.findById(noteId);
  
  if (!note) {
    return { authorized: false, status: 404, message: 'Note not found' };
  }
  
  // Check if the user is the owner of the note
  if (note.createdBy.toString() !== userId) {
    // If note is public and user is just trying to view it
    if (note.isPublic) {
      return { 
        authorized: true, 
        note,
        isOwner: false,
        canEdit: false
      };
    }
    return { 
      authorized: false, 
      status: 403, 
      message: 'Not authorized to access this note' 
    };
  }
  
  return { 
    authorized: true, 
    note,
    isOwner: true,
    canEdit: true
  };
}

// GET /api/notes/[id] - Get a specific note
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    const { 
      authorized, 
      status, 
      message, 
      note,
      isOwner,
      canEdit
    } = await authorizeNoteAccess(id, session.user.id);
    
    if (!authorized) {
      return NextResponse.json(
        { success: false, message },
        { status }
      );
    }

    // Populate the note with related data
    const populatedNote = await Note.findById(note._id)
      .populate('tags', 'name color')
      .populate('createdBy', 'name email')
      .populate('lastEditedBy', 'name email')
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        ...populatedNote,
        isOwner,
        canEdit
      }
    });
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

// PUT /api/notes/[id] - Update a note
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = params;
    const data = await request.json();
    
    const { 
      authorized, 
      status, 
      message, 
      note,
      canEdit
    } = await authorizeNoteAccess(id, session.user.id);
    
    if (!authorized) {
      return NextResponse.json(
        { success: false, message },
        { status }
      );
    }
    
    if (!canEdit) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to edit this note' },
        { status: 403 }
      );
    }

    // Update the note with tags
    const updatedNote = await note.updateWithTags({
      title: data.title?.trim(),
      content: data.content?.trim(),
      isPublic: data.isPublic,
      isPinned: data.isPinned,
      color: data.color,
      tags: data.tags || []
    }, session.user.id);

    // Populate the updated note with related data
    const populatedNote = await Note.findById(updatedNote._id)
      .populate('tags', 'name color')
      .populate('createdBy', 'name email')
      .populate('lastEditedBy', 'name email')
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        ...populatedNote,
        isOwner: true,
        canEdit: true
      }
    });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    const { 
      authorized, 
      status, 
      message, 
      note,
      canEdit
    } = await authorizeNoteAccess(id, session.user.id);
    
    if (!authorized) {
      return NextResponse.json(
        { success: false, message },
        { status }
      );
    }
    
    if (!canEdit) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to delete this note' },
        { status: 403 }
      );
    }

    // Delete the note (this will trigger the pre-remove hook for tag cleanup)
    await note.remove();

    return NextResponse.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete note' },
      { status: 500 }
    );
  }
}

// PATCH /api/notes/[id]/archive - Archive/Unarchive a note
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { isArchived } = await request.json();
    
    const { 
      authorized, 
      status, 
      message, 
      note,
      canEdit
    } = await authorizeNoteAccess(id, session.user.id);
    
    if (!authorized) {
      return NextResponse.json(
        { success: false, message },
        { status }
      );
    }
    
    if (!canEdit) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to modify this note' },
        { status: 403 }
      );
    }

    // Update the archive status
    note.isArchived = isArchived;
    note.lastEditedBy = session.user.id;
    await note.save();

    return NextResponse.json({
      success: true,
      message: `Note ${isArchived ? 'archived' : 'restored'} successfully`
    });
  } catch (error) {
    console.error('Error toggling archive status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update note' },
      { status: 500 }
    );
  }
}
