import { Badge } from "@/components/ui/badge"
import { Lock, Users, Globe } from 'lucide-react'


export function NoteCard({ note, showVisibility = false }) {
  const getVisibilityIcon = () => {
    switch (note.visibility) {
      case 'private':
        return <Lock className="w-3 h-3" />
      case 'followers':
        return <Users className="w-3 h-3" />
      case 'public':
        return <Globe className="w-3 h-3" />
    }
  }

  const getVisibilityColor = () => {
    switch (note.visibility) {
      case 'private':
        return 'bg-red-100 text-red-800'
      case 'followers':
        return 'bg-yellow-100 text-yellow-800'
      case 'public':
        return 'bg-green-100 text-green-800'
    }
  }

  return (
    <div className="flex gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {note.tag}
          </Badge>
          {showVisibility && (
            <Badge className={`text-xs flex items-center gap-1 ${getVisibilityColor()}`}>
              {getVisibilityIcon()}
              {note.visibility}
            </Badge>
          )}
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {note.title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-3 mb-2">
          {note.description}
        </p>
        
        <p className="text-xs text-gray-400">
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
      
      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={note.thumbnail || "/placeholder.svg"} 
          alt={note.title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
