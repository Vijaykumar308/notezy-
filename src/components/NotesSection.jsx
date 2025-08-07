import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NoteCard } from "./NoteCard"

export function NotesSection({ notes, isOwnProfile, isFollowing }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const getVisibleNotes = () => {
    if (isOwnProfile) {
      // Own profile: show notes based on filter
      if (activeFilter === 'all') return notes
      return notes.filter(note => note.visibility === activeFilter)
    } else {
      // Other user's profile: show based on relationship
      if (isFollowing) {
        return notes.filter(note => note.visibility === 'public' || note.visibility === 'followers')
      } else {
        return notes.filter(note => note.visibility === 'public')
      }
    }
  }

  const visibleNotes = getVisibleNotes()

  return (
    <div className="p-4">
      {isOwnProfile && (
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            All Notes ({notes.length})
          </Button>
          <Button
            variant={activeFilter === 'public' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('public')}
          >
            Public ({notes.filter(n => n.visibility === 'public').length})
          </Button>
          <Button
            variant={activeFilter === 'private' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('private')}
          >
            Private ({notes.filter(n => n.visibility === 'private').length})
          </Button>
          <Button
            variant={activeFilter === 'followers' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('followers')}
          >
            Followers ({notes.filter(n => n.visibility === 'followers').length})
          </Button>
        </div>
      )}

      <div className="space-y-0">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {isOwnProfile ? 
            (activeFilter === 'all' ? 'All Notes' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Notes`) :
            'Public Notes'
          }
        </h2>
        
        {visibleNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No notes to display</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            {visibleNotes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                showVisibility={isOwnProfile}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
