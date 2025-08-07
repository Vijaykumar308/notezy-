import { Badge } from "@/components/ui/badge"

const availableTags = ["Productivity", "Ideas", "Personal"]

export function TagSelector({ selectedTags = [], onTagToggle = () => {} }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "secondary"}
            className={`cursor-pointer transition-colors ${
              selectedTags.includes(tag)
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
