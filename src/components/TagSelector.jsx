"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "react-toastify"

export function TagSelector({ selectedTags = [], onTagToggle = () => {}, disabled = false }) {
  const [availableTags, setAvailableTags] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    const fetchTags = async () => {
      if (!token) return
      
      try {
        setIsLoading(true)
        const response = await fetch('/api/tags', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch tags')
        }
        
        const data = await response.json()
        if (data.success) {
          setAvailableTags(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching tags:', error)
        toast.error('Failed to load tags')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTags()
  }, [token])

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map(i => (
            <Badge key={i} variant="secondary" className="animate-pulse w-16 h-6" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {availableTags.length > 0 ? (
          availableTags.map((tag) => (
            <Badge
              key={tag._id}
              variant={selectedTags.includes(tag._id) ? "default" : "secondary"}
              className={`cursor-pointer transition-colors ${selectedTags.includes(tag._id) ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
              style={{
                backgroundColor: selectedTags.includes(tag._id) ? (tag.color || '#3b82f6') : `${tag.color}40`,
                color: selectedTags.includes(tag._id) ? '#fff' : (tag.color || '#000'),
                borderColor: tag.color || '#3b82f6',
              }}
              onClick={() => !disabled && onTagToggle(tag._id)}
            >
              {tag.name}
            </Badge>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No tags available. Create some in the settings.</p>
        )}
      </div>
    </div>
  )
}
