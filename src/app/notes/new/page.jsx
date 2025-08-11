'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { NoteForm } from '@/components/NoteForm';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useAuth } from '@/contexts/AuthContext';

export default function NewNotePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push('/login?redirect=/notes/new');
    return null;
  }

  const handleSuccess = () => {
    toast.success('Note created successfully!');
    router.push('/notes');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Note</h1>
          <p className="text-muted-foreground">
            Jot down your thoughts, ideas, and important information.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleCancel}
          className="hidden sm:flex items-center gap-2"
        >
          <Icons.arrowLeft className="h-4 w-4" />
          Back to Notes
        </Button>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <NoteForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
