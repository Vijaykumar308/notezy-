"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TagSelector } from "./TagSelector"
import { VisibilitySelector } from "./VisibilitySelector"
import { toast } from "react-toastify"
import dynamic from 'next/dynamic'; 

// Import RichTextEditor with dynamic import and no SSR
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] p-4 border border-t-0 border-gray-200 rounded-b-lg">
      Loading editor...
    </div>
  )
});

export function NoteForm({ onSuccess, onCancel, isSubmitting: propIsSubmitting }) {
  const router = useRouter()
  const { token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(propIsSubmitting || false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPublic: false,
    tags: [],
    color: "#ffffff",
    fontColor: "#000000"
  });
  const [availableTags, setAvailableTags] = useState([]);
  
  // Function to determine if a color is light or dark
  const isLightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  }
  
  // Auto-detect text color if not manually set
  const textColor = formData.fontColor || (isLightColor(formData.color) ? '#000000' : '#ffffff');

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      if (!token) return;
      
      try {
        const response = await fetch('/api/tags', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAvailableTags(data.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    
    fetchTags();
  }, [token]);

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!token) {
      toast.error("Please log in to create notes")
      return
    }

    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!formData.content.trim()) {
      toast.error("Content is required")
      return
    }

    try {
      setIsSubmitting(true)
      
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          isPublic: formData.isPublic,
          tags: formData.tags,
          color: formData.color
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create note');
      }

      const data = await response.json()
      toast.success("Note created successfully!")
      
      // Reset form
      setFormData({
        title: "",
        content: "",
        isPublic: false,
        tags: [],
        color: "#ffffff",
        fontColor: "#000000"
      })

      if (onSuccess) {
        onSuccess(data.data)
      } else {
        router.push('/notes')
      }
    } catch (error) {
      console.error('Error creating note:', error)
      toast.error(error.message || 'Failed to create note')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 p-6 rounded-lg border border-gray-200 shadow-sm overflow-y-auto flex-1 flex flex-col"
      >
        <div className="space-y-6 flex-1">
          <h2 className="text-2xl font-bold">New Note</h2>
          
          <div className="space-y-4">
            <div>
              <Input
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full text-lg"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mt-2">
              <div className="border rounded-lg overflow-hidden">
                <RichTextEditor
                  content={formData.content}
                  onChange={handleContentChange}
                  className={`w-full min-h-[300px] resize-none text-base bg-transparent`}
                  style={{ color: textColor }}
                />
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Available Tags</h3>
                <TagSelector 
                  selectedTags={formData.tags}
                  onTagToggle={handleTagToggle}
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Selected Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tagId => {
                      const tag = availableTags.find(t => t._id === tagId);
                      if (!tag) return null;
                      return (
                        <span
                          key={tag._id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${tag.color}40`,
                            color: tag.color,
                            border: `1px solid ${tag.color}`,
                            cursor: 'pointer'
                          }}
                          onClick={() => handleTagToggle(tag._id)}
                        >
                          {tag.name}
                          <button 
                            type="button"
                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-opacity-30"
                            style={{ backgroundColor: `${tag.color}40` }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTagToggle(tag._id);
                            }}
                          >
                            <span className="sr-only">Remove tag</span>
                            <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <VisibilitySelector 
                  value={formData.isPublic ? 'public' : 'private'}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    isPublic: value === 'public'
                  }))}
                  disabled={isSubmitting}
                />
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Background:</span>
                    <div className="relative">
                      <input
                        type="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                        style={{ 
                          backgroundColor: formData.color,
                          borderColor: isLightColor(formData.color) ? '#9ca3af' : '#4b5563'
                        }}
                        disabled={isSubmitting}
                        title="Choose background color"
                      />
                      <div 
                        className="absolute inset-0 rounded-full border-2 pointer-events-none"
                        style={{ 
                          borderColor: isLightColor(formData.color) ? '#00000033' : '#ffffff33'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Text:</span>
                    <div className="relative">
                      <input
                        type="color"
                        name="fontColor"
                        value={formData.fontColor}
                        onChange={handleInputChange}
                        className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                        style={{ 
                          backgroundColor: formData.fontColor,
                          borderColor: isLightColor(formData.fontColor) ? '#9ca3af' : '#4b5563'
                        }}
                        disabled={isSubmitting}
                        title="Choose text color"
                      />
                      <div 
                        className="absolute inset-0 rounded-full border-2 pointer-events-none"
                        style={{ 
                          borderColor: isLightColor(formData.fontColor) ? '#00000033' : '#ffffff33'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Preview Section */}
              <div className="mt-4 p-6 rounded-lg border border-gray-200 shadow-sm transition-colors duration-200"
                style={{ 
                  backgroundColor: formData.color,
                  color: formData.fontColor,
                  maxHeight: '40vh',
                  overflowY: 'auto',
                  minHeight: '200px'
                }}
              >
                <h3 className="text-2xl font-semibold mb-4">
                  {formData.title || 'Your Note Title'}
                </h3>
                <div className="flex-1">
                  {formData.content ? (
                    <p className="whitespace-pre-wrap">{formData.content}</p>
                  ) : (
                    <p className="opacity-70 text-center my-8">Your note preview will appear here</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={onCancel || (() => {
                    setFormData({
                      title: "",
                      content: "",
                      isPublic: false,
                      tags: [],
                      color: "#ffffff",
                      fontColor: "#000000"
                    });
                  })}
                  disabled={isSubmitting}
                  className="px-6"
                >
                  {onCancel ? 'Cancel' : 'Clear'}
                </Button>
              </div>
              
              <Button 
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                className="px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white"
              >
                {isSubmitting ? 'Saving...' : 'Save Note'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
