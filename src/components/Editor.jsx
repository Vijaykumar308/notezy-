'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Client-side only editor wrapper
export default function Editor({ content, onChange }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This will only run on the client side
    setIsClient(true);
  }, []);

  // Only import TiptapEditor on the client side
  const TiptapEditor = dynamic(
    () => {
      // Double check we're on the client
      if (typeof window === 'undefined') {
        return Promise.resolve(() => null);
      }
      return import('./TiptapEditor');
    },
    { 
      ssr: false,
      loading: () => (
        <div className="min-h-[200px] p-4 border border-t-0 border-gray-200 rounded-b-lg">
          Loading editor...
        </div>
      )
    }
  );

  if (!isClient) {
    return (
      <div className="min-h-[200px] p-4 border border-t-0 border-gray-200 rounded-b-lg">
        Loading editor...
      </div>
    );
  }

  return <TiptapEditor content={content} onChange={onChange} />;
}
