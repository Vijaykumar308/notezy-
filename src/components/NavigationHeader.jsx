import { Star, Search, Plus, } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CreateNotesButton from './CreateNotesButton'
import ProfileDropdown from './ProfileDropdown'

export function NavigationHeader({ currentUser }) {
  
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-gray-700" />
          <h1 className="text-lg font-semibold text-gray-900">NoteShare</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm text-gray-600 hover:text-gray-900">Home</a>
          <a href="/explore" className="text-sm text-gray-600 hover:text-gray-900">Explore</a>
          <a href="/notifications" className="text-sm text-gray-600 hover:text-gray-900">Notifications</a>
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-10 w-64 bg-gray-50 border-gray-200"
          />
        </div>
        
        <CreateNotesButton />
        
        <ProfileDropdown currentUser={currentUser} />
      </div>
    </header>
  )
}
