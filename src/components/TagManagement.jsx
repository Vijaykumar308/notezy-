import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const existingTags = ["Work", "Study", "Travel", "Recipes", "Books"]

export function TagManagement() {
  const [newTag, setNewTag] = useState("")

  const handleAddTag = () => {
    if (newTag.trim()) {
      // In a real app, this would add the tag to a state or database
      console.log("Adding tag:", newTag)
      setNewTag("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Manage Tags</h2>
        
        <div className="space-y-3">
          <Input
            placeholder="Create New Tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="w-full"
          />
          <Button 
            onClick={handleAddTag}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Add Tag
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Existing Tags</h3>
        <div className="flex flex-wrap gap-2">
          {existingTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
