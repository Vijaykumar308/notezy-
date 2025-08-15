'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const RichTextEditor = ({ content = '', onChange }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Dynamically import the editor with SSR disabled
  const Editor = dynamic(() => import('./CustomEditor'), { ssr: false });

  if (!isMounted) {
    return (
      <div className="min-h-[200px] p-4 border border-gray-200 rounded-lg">
        Loading editor...
      </div>
    );
  }

  return <Editor content={content} onChange={onChange} />;
};

export default RichTextEditor;
