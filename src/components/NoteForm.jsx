"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TagSelector } from "./TagSelector"
import { VisibilitySelector } from "./VisibilitySelector"
import { toast } from "react-toastify"
import dynamic from 'next/dynamic';

// Dynamically import RichTextEditor with SSR disabled
const RichTextEditor = dynamic(
  () => import('./RichTextEditor'),
  { ssr: false }
);

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
  })
  
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

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }))
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
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
                onChange={handleInputChange}
                className={`w-full min-h-[300px] resize-none text-base bg-transparent border-${isLightColor(formData.color) ? 'gray-200' : 'gray-600'}`}
                style={{ color: textColor }}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-4 pt-2">
              <TagSelector 
                selectedTags={formData.tags}
                onTagToggle={handleTagToggle}
                disabled={isSubmitting}
              />
              
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
