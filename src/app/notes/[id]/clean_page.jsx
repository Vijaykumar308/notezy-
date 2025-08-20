"use client";

import NoteReadingPage from "@/components/NoteReadingPage";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { headers } from 'next/headers';

// Function to fetch note data from the API
async function getNote(noteId) {
  // Get the host from the headers
  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: 'Not authenticated' };
    }

    const res = await fetch(`${baseUrl}/api/notes/${noteId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': headers().get('cookie') || ''
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || 'Failed to fetch note' };
    }

    const data = await res.json();
    if (!data.success) {
      return { error: data.message || 'Failed to fetch note' };
    }

    // Transform the data to match the NoteReadingPage component's expected format
    const note = data.data;
    return {
      ...note,
      id: note._id,
      title: note.title || 'Untitled Note',
      content: note.content || '',
      author: {
        name: note.createdBy?.name || 'Unknown',
        avatar: note.createdBy?.image || '',
        initials: (note.createdBy?.name || 'U')[0].toUpperCase()
      },
      publishedDate: new Date(note.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      readTime: Math.ceil((note.content || '').split(/\s+/).length / 200) + ' min read',
      category: note.category || 'General',
      tags: note.tags?.map(tag => tag.name) || [],
      likes: note.likes || 0,
      bookmarks: note.bookmarks || 0,
      isPublic: note.isPublic || false
    };
  } catch (error) {
    console.error('Error fetching note:', error);
    return { error: 'Failed to fetch note' };
  }
}

export async function generateMetadata({ params }) {
  const note = await getNote(params.id);
  
  if (note.error) {
    return {
      title: "Note Not Found | Notezy"
    };
  }

  return {
    title: `${note.title} | Notezy`,
    description: note.content?.substring(0, 160) + "..."
  };
}

export default async function NotePage({ params }) {
  const note = await getNote(params.id);

  if (note.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Note Not Found</h1>
          <p className="text-gray-600 mb-6">
            {note.error === 'Not authenticated' 
              ? 'You need to be logged in to view this note.' 
              : 'The note you\'re looking for doesn\'t exist or you don\'t have permission to view it.'}
          </p>
          <a
            href={note.error === 'Not authenticated' ? '/login' : '/notes'}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {note.error === 'Not authenticated' ? 'Log In' : 'Back to Notes'}
          </a>
        </div>
      </div>
    );
  }

  return <NoteReadingPage note={note} />;
}
