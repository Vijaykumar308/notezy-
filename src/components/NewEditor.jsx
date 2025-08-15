'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState, useCallback } from 'react';

// Simple editor component with minimal extensions
const NewEditor = ({ content, onChange }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [editorContent, setEditorContent] = useState(content || '');

  // Only initialize editor on client side
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable extensions that might cause hydration issues
        dropcursor: false,
        gapcursor: false,
      }),
    ],
    content: editorContent,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px] p-4 border border-gray-200 rounded-b-lg',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditorContent(html);
      onChange?.(html);
    },
  });

  // Set mounted state after initial render
  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editorContent) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  // Don't render anything during SSR
  if (!isMounted) {
    return (
      <div className="min-h-[200px] p-4 border border-gray-200 rounded-b-lg">
        Loading editor...
      </div>
    );
  }

  return <EditorContent editor={editor} />;
};

export default NewEditor;
