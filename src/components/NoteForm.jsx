"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TagSelector } from "./TagSelector"
import { VisibilitySelector } from "./VisibilitySelector"

export function NoteForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [visibility, setVisibility] = useState("public")

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleSave = () => {
    // In a real app, this would save the note
    console.log("Saving note:", { title, content, selectedTags, visibility })
  }

  const handleCancel = () => {
    setTitle("")
    setContent("")
    setSelectedTags([])
    setVisibility("public")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">New Note</h2>
      
      <div className="space-y-4">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
        
        <Textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[200px] resize-none"
        />
        
        <TagSelector 
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
        
        <VisibilitySelector 
          value={visibility}
          onValueChange={setVisibility}
        />
        
        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="px-6"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="px-6 bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
