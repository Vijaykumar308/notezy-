import { Search, Plus, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import Link from "next/link"

// Helper function to convert title to slug
function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
}

export default function HomePage() {
  const notes = [
    {
      id: 1,
      title: "Meeting Notes",
      slug: titleToSlug("Meeting Notes"),
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-gray-200"
    },
    {
      id: 2,
      title: "Project Brainstorm",
      slug: titleToSlug("Project Brainstorm"),
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-emerald-700"
    },
    {
      id: 3,
      title: "Grocery List",
      slug: titleToSlug("Grocery List"),
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-rose-200"
    },
    {
      id: 4,
      title: "Travel Plans",
      slug: titleToSlug("Travel Plans"),
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-blue-500"
    },
    {
      id: 5,
      title: "Book Recommendations",
      slug: titleToSlug("Book Recommendations"),
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-green-600"
    },
    {
      id: 6,
      title: "Personal Journal",
      slug: titleToSlug("Personal Journal"),
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-amber-200"
    },
    {
      id: 7,
      title: "Recipe Collection",
      slug: titleToSlug("Recipe Collection"),
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-orange-200"
    },
    {
      id: 8,
      title: "Workout Routine",
      slug: titleToSlug("Workout Routine"),
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-red-200"
    },
    {
      id: 9,
      title: "Learning Goals",
      slug: titleToSlug("Learning Goals"),
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-indigo-200"
    },
    {
      id: 10,
      title: "Garden Planning",
      slug: titleToSlug("Garden Planning"),
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-green-200"
    },
    {
      id: 11,
      title: "Photography Tips",
      slug: titleToSlug("Photography Tips"),
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-purple-200"
    },
    {
      id: 12,
      title: "Budget Planning",
      slug: titleToSlug("Budget Planning"),
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-yellow-200"
    },
    {
      id: 13,
      title: "Home Improvement",
      slug: titleToSlug("Home Improvement"),
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-teal-200"
    },
    {
      id: 14,
      title: "Movie Watchlist",
      slug: titleToSlug("Movie Watchlist"),
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-pink-200"
    },
    {
      id: 15,
      title: "Tech Research",
      slug: titleToSlug("Tech Research"),
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-cyan-200"
    },
    {
      id: 16,
      title: "Daily Habits",
      slug: titleToSlug("Daily Habits"),
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-lime-200"
    },
    {
      id: 17,
      title: "Career Goals",
      slug: titleToSlug("Career Goals"),
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-slate-200"
    },
    {
      id: 18,
      title: "Music Playlist",
      slug: titleToSlug("Music Playlist"),
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-violet-200"
    },
    {
      id: 19,
      title: "Weekend Projects",
      slug: titleToSlug("Weekend Projects"),
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-rose-300"
    },
    {
      id: 20,
      title: "Mindfulness Practice",
      slug: titleToSlug("Mindfulness Practice"),
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
      bgColor: "bg-emerald-200"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
    
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Notes</h1>

        {/* Search Notes */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search notes"
              className="pl-10 bg-white border-gray-200"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white">
                Sort by
                <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Date created</DropdownMenuItem>
              <DropdownMenuItem>Date modified</DropdownMenuItem>
              <DropdownMenuItem>Title</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white">
                Filter
                <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All notes</DropdownMenuItem>
              <DropdownMenuItem>Personal</DropdownMenuItem>
              <DropdownMenuItem>Work</DropdownMenuItem>
              <DropdownMenuItem>Projects</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notes.map((note) => (
            <Link key={note.id} href={`/reads/${note.slug}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden border-0 shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={note.image || "/placeholder.svg"}
                    alt={note.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg leading-tight">
                      {note.title}
                    </h3>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
