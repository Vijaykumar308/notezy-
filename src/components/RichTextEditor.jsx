'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Move dynamic import outside the component
const DynamicEditor = dynamic(() => import('./CustomEditor'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] p-4 border border-gray-200 rounded-lg">
      Loading editor...
    </div>
  )
});

const RichTextEditor = ({ content = '', onChange }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoize the editor to prevent re-renders
  const editor = useMemo(() => {
    return (
      <DynamicEditor 
        key="editor"
        content={content} 
        onChange={onChange} 
      />
    );
  }, [content, onChange]);

  if (!isMounted) {
    return (
      <div className="min-h-[200px] p-4 border border-gray-200 rounded-lg">
        Loading editor...
      </div>
    );
  }

  return editor;
};

export default RichTextEditor;
