'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

export default function CustomEditor({ content = '', onChange }) {
  const editorRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);
  const lastHtml = useRef('');

  // Save and restore selection
  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    return selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  }, []);

  const restoreSelection = useCallback((savedRange) => {
    if (!savedRange) return;
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    
    try {
      selection.addRange(savedRange);
    } catch (e) {
      // Ignore DOMException when selection is no longer valid
    }
  }, []);

  // Handle input changes with debounce
  const handleInput = useCallback(() => {
    if (!editorRef.current || isComposing) return;
    
    const newHtml = editorRef.current.innerHTML;
    if (newHtml !== lastHtml.current) {
      lastHtml.current = newHtml;
      // Use requestAnimationFrame to batch updates and prevent layout thrashing
      requestAnimationFrame(() => {
        onChange?.(newHtml);
      });
    }
  }, [isComposing, onChange]);

  // Handle paste
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // Format text with selection preservation
  const formatText = useCallback((command, value = null) => {
    if (!editorRef.current) return;
    
    // Save current selection
    const selection = saveSelection();
    
    // Apply format
    document.execCommand(command, false, value);
    
    // Restore selection and focus
    if (editorRef.current) {
      if (selection) {
        restoreSelection(selection);
      }
      editorRef.current.focus();
      
      // Update content after formatting without causing re-render
      const newHtml = editorRef.current.innerHTML;
      lastHtml.current = newHtml;
      // Use setTimeout to prevent blocking the UI thread
      setTimeout(() => {
        onChange?.(newHtml);
      }, 0);
    }
  }, [saveSelection, restoreSelection, handleInput]);

  // Set initial content - only on mount
  useEffect(() => {
    if (editorRef.current && content !== undefined && content !== null) {
      editorRef.current.innerHTML = content;
      lastHtml.current = content;
    }
    // Empty dependency array means this effect runs only once on mount
  }, []);

  // Check if current selection has a specific format
  const isFormatActive = useCallback((format) => {
    if (!editorRef.current) return false;
    return document.queryCommandState(format);
  }, []);

  // Toolbar button component
  const ToolbarButton = useCallback(({ onClick, title, children, format }) => {
    const isActive = format ? isFormatActive(format) : false;
    
    return (
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={`p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-200' : ''}`}
        title={title}
      >
        {children}
      </button>
    );
  }, [isFormatActive]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div 
        className="bg-gray-50 p-2 border-b border-gray-200 flex flex-wrap gap-1"
        onClick={(e) => e.preventDefault()} // Prevent editor blur on toolbar click
      >
        <ToolbarButton 
          onClick={() => formatText('bold')} 
          title="Bold"
          format="bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => formatText('italic')} 
          title="Italic"
          format="italic"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => formatText('underline')} 
          title="Underline"
          format="underline"
        >
          <u>U</u>
        </ToolbarButton>
        <div className="border-l border-gray-300 h-6 mx-1" />
        <select
          onChange={(e) => formatText('formatBlock', e.target.value)}
          className="p-1 rounded border border-gray-300 bg-white"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <div className="border-l border-gray-300 h-6 mx-1" />
        <ToolbarButton 
          onClick={() => formatText('insertUnorderedList')} 
          title="Bullet List"
        >
          • List
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => formatText('insertOrderedList')} 
          title="Numbered List"
        >
          1. List
        </ToolbarButton>
        <div className="border-l border-gray-300 h-6 mx-1" />
        <input
          type="color"
          onChange={(e) => formatText('foreColor', e.target.value)}
          className="h-8 w-8 cursor-pointer"
          title="Text Color"
        />
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 outline-none focus:ring-2 focus:ring-blue-200"
        onInput={handleInput}
        onPaste={handlePaste}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => {
          setIsComposing(false);
          handleInput();
        }}
        onKeyDown={(e) => {
          // Handle Enter key for better list behavior
          if (e.key === 'Enter' && !e.shiftKey) {
            if (!document.queryCommandState('insertUnorderedList') && 
                !document.queryCommandState('insertOrderedList')) {
              document.execCommand('formatBlock', false, '<p>');
            }
          }
        }}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
