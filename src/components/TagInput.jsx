'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TagInput({
  value = [],
  onChange,
  availableTags = [],
  onCreateTag,
  placeholder = 'Add tags...',
  disabled = false,
  className = ''
}) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Filter available tags based on input
  const filteredTags = availableTags.filter(
    tag => 
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.some(selectedTag => selectedTag._id === tag._id)
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      
      if (trimmedValue) {
        addTag(trimmedValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove the last tag when backspace is pressed and input is empty
      removeTag(value[value.length - 1]._id);
    }
  };

  const addTag = async (tagName) => {
    const trimmedName = tagName.trim();
    if (!trimmedName) return;

    // Check if tag already exists
    const existingTag = availableTags.find(
      tag => tag.name.toLowerCase() === trimmedName.toLowerCase()
    );

    try {
      let tagToAdd = existingTag;
      
      // If tag doesn't exist, create it
      if (!existingTag) {
        if (onCreateTag) {
          const newTag = await onCreateTag(trimmedName);
          tagToAdd = { _id: newTag._id, name: newTag.name };
        } else {
          tagToAdd = { _id: `temp-${Date.now()}`, name: trimmedName };
        }
      }

      if (tagToAdd && !value.some(tag => tag._id === tagToAdd._id)) {
        onChange([...value, tagToAdd]);
      }
      
      setInputValue('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const removeTag = (tagId) => {
    onChange(value.filter(tag => tag._id !== tagId));
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      // If there's text in the input, add it as a tag when clicking away
      if (inputValue.trim()) {
        addTag(inputValue);
      }
      setIsFocused(false);
    }
  };

  // Add click outside listener
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputValue, value]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative w-full min-h-10 p-1 border rounded-md bg-background',
        'flex flex-wrap items-center gap-2',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Selected Tags */}
      {value.map(tag => (
        <div
          key={tag._id}
          className={cn(
            'inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md',
            'bg-primary/10 text-primary',
            !disabled && 'hover:bg-primary/20',
            'transition-colors duration-200',
            'group'
          )}
        >
          <span>{tag.name}</span>
          {!disabled && (
            <button
              type="button"
              className="opacity-70 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag._id);
              }}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}

      {/* Tag Input */}
      <div className="relative flex-1 min-w-[100px]">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          className={cn(
            'w-full bg-transparent outline-none text-sm',
            'placeholder:text-muted-foreground/50',
            'min-w-[100px]',
            disabled && 'cursor-not-allowed'
          )}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled}
        />

        {/* Tag Suggestions */}
        {isFocused && inputValue && filteredTags.length > 0 && (
          <div className="absolute z-10 w-full mt-1 overflow-hidden bg-white border rounded-md shadow-lg top-full dark:bg-gray-800">
            <ul className="py-1">
              {filteredTags.slice(0, 5).map(tag => (
                <li key={tag._id}>
                  <button
                    type="button"
                    className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      addTag(tag.name);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{tag.name}</span>
                  </button>
                </li>
              ))}
              {!filteredTags.some(tag => 
                tag.name.toLowerCase() === inputValue.toLowerCase()
              ) && inputValue && (
                <li>
                  <button
                    type="button"
                    className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => addTag(inputValue)}
                  >
                    <Plus className="w-4 h-4 mr-2 text-primary" />
                    <span>Create "{inputValue}"</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
