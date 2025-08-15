'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Link } from '@tiptap/extension-link';
import { useEffect, useRef, useState } from 'react';

// Create a custom Link extension
const CustomLink = Link.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: false,
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      // Explicitly set to prevent hydration issues
      immediatelyRender: false,
      // Add these to help with SSR
      _tiptap: {
        isInline: true,
        isText: true,
        isLeaf: true,
      },
    };
  },
  // Add renderHTML method to ensure consistent rendering
  renderHTML({ HTMLAttributes }) {
    return ['a', HTMLAttributes, 0];
  },
});

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="editor-menu border border-gray-200 p-2 rounded-t-lg flex flex-wrap gap-1 bg-gray-50">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        title="Bold"
      >
        <b>B</b>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        title="Italic"
      >
        <i>I</i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1 rounded ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        title="Underline"
      >
        <u>U</u>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1 rounded ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
        title="Strikethrough"
      >
        <s>S</s>
      </button>
      <div className="border-l border-gray-300 h-6 mx-1"></div>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
        title="Heading 1"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
        title="Heading 2"
      >
        H2
      </button>
      <div className="border-l border-gray-300 h-6 mx-1"></div>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        title="Bullet List"
      >
        • List
      </button>
      <button
        onClick={setLink}
        className={`p-1 rounded ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
        title="Add Link"
      >
        🔗
      </button>
      <input
        type="color"
        onInput={event => editor.chain().focus().setColor(event.target.value).run()}
        value={editor.getAttributes('textStyle').color || '#000000'}
        title="Text Color"
        className="h-8 w-8"
      />
    </div>
  );
};

const TiptapEditor = ({ content, onChange }) => {
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    try {
      setIsMounted(true);
      return () => {
        // Cleanup editor on unmount
        if (editorRef.current) {
          try {
            editorRef.current.destroy();
          } catch (e) {
            console.error('Error destroying editor:', e);
          }
          editorRef.current = null;
        }
      };
    } catch (e) {
      console.error('Editor initialization error:', e);
      setError('Failed to initialize editor');
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable the gapcursor extension as it can cause hydration issues
        dropcursor: false,
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CustomLink,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      try {
        const html = editor.getHTML();
        onChange(html);
      } catch (e) {
        console.error('Error in onUpdate:', e);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px] p-4 border border-t-0 border-gray-200 rounded-b-lg',
      },
    },
    onCreate: ({ editor }) => {
      editorRef.current = editor;
    },
    // Add this to prevent hydration issues
    autofocus: false,
    injectCSS: false,
  });

  if (!isMounted || error) {
    return (
      <div className="min-h-[200px] p-4 border border-t-0 border-gray-200 rounded-b-lg">
        {error || 'Initializing editor...'}
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="min-h-[200px] p-4 border border-t-0 border-gray-200 rounded-b-lg">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="editor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
