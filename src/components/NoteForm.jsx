"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TagSelector } from "./TagSelector"
import { VisibilitySelector } from "./VisibilitySelector"
import { toast } from "react-toastify"

export function NoteForm({ onSuccess, onCancel, isSubmitting: propIsSubmitting }) {
  const router = useRouter()
  const { token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(propIsSubmitting || false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPublic: false,
    tags: [],
    color: "#ffffff"
  })

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }))
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
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
      
      // Log token information
      console.log('Token from AuthContext:', token ? 'Token exists' : 'No token found');
      if (token) {
        console.log('Token length:', token.length);
        console.log('Token prefix:', token.substring(0, 10) + '...');
      }
      
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
      
      console.log('API Response Status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(errorText || 'Failed to create note');
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create note')
      }

      toast.success("Note created successfully!")
      
      // Reset form
      setFormData({
        title: "",
        content: "",
        isPublic: false,
        tags: [],
        color: "#ffffff"
      })

      // Call onSuccess callback if provided (e.g., to close a modal)
      if (onSuccess) {
        onSuccess(data.data)
      } else {
        // Otherwise, redirect to notes list
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Note</h2>
      
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
        
        <div className="relative">
          <Textarea
            name="content"
            placeholder="Write your note here..."
            value={formData.content}
            onChange={handleInputChange}
            className="w-full min-h-[300px] resize-none text-base"
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
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Color:</span>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  color: e.target.value
                }))}
                className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {onCancel ? (
              <Button 
                type="button"
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-6"
              >
                Cancel
              </Button>
            ) : (
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  setFormData({
                    title: "",
                    content: "",
                    isPublic: false,
                    tags: [],
                    color: "#ffffff"
                  })
                }}
                disabled={isSubmitting}
                className="px-6"
              >
                Clear
              </Button>
            )}
            <Button 
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
              className="px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
