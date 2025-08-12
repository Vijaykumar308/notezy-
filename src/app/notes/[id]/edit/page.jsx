'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { NoteForm } from '@/components/NoteForm';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useAuth } from '@/contexts/AuthContext';

export default function EditNotePage({ params }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = params;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/notes/${id}/edit`);
    }
  }, [isAuthenticated, router, id]);

  // Fetch note data
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchNote = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/notes/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch note');
        }
        
        if (!data.data) {
          throw new Error('Note not found');
        }
        
        if (!data.data.canEdit) {
          toast.error('You do not have permission to edit this note');
          router.push(`/notes/${id}`);
          return;
        }
        
        setNote(data.data);
      } catch (error) {
        console.error('Error fetching note:', error);
        toast.error(error.message || 'Failed to load note');
        router.push('/notes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id, isAuthenticated, router]);

  const handleSuccess = (updatedNote) => {
    toast.success('Note updated successfully!');
    router.push(`/notes/${id}`);
  };

  const handleCancel = () => {
    router.push(`/notes/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Note Not Found</h1>
          <p className="text-gray-600 mb-8">The note you're trying to edit doesn't exist or you don't have permission to edit it.</p>
          <Button
            onClick={() => router.push('/notes')}
            className="gap-2"
          >
            <Icons.arrowLeft className="h-4 w-4" />
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Note</h1>
          <p className="text-muted-foreground">
            Make changes to your note below.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/notes/${id}`)}
          className="hidden sm:flex items-center gap-2"
        >
          <Icons.arrowLeft className="h-4 w-4" />
          Back to Note
        </Button>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <NoteForm 
          initialData={{
            ...note,
            // Ensure tags are in the correct format for the form
            tags: note.tags?.map(tag => ({
              _id: typeof tag === 'string' ? tag : tag._id,
              name: typeof tag === 'string' ? tag : tag.name
            })) || []
          }}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
