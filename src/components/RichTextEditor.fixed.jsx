'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Client-side only editor component
const RichTextEditor = ({ content, onChange }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // This effect only runs on the client side
    setIsClient(true);
  }, []);

  // Dynamically import the editor with SSR disabled
  const Editor = dynamic(
    () => import('./NewEditor'),
    { 
      ssr: false,
      loading: () => (
        <div className="min-h-[200px] p-4 border border-t-0 border-gray-200 rounded-b-lg">
          Loading editor...
        </div>
      )
    }
  );

  // Don't render anything during SSR
  if (!isClient) {
    return (
      <div className="min-h-[200px] p-4 border border-t-0 border-gray-200 rounded-b-lg">
        Loading editor...
      </div>
    );
  }

  return <Editor content={content} onChange={onChange} />;
};

export default RichTextEditor;
