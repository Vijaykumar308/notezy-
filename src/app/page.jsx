"use client";
import { useState } from "react";
import { NoteCard } from "@/components/NoteCard";
import { Button } from "@/components/ui/button";

// Mock data for demonstration
const mockFeedNotes = [
  {
    id: "101",
    title: "How to Stay Productive as a Developer",
    slug: "how-to-stay-productive-as-a-developer",
    description: "Discover actionable strategies and tips for maintaining productivity, focus, and motivation as a software developer, even when working remotely or facing distractions.",
    tag: "Productivity",
    visibility: "public",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    createdAt: "2024-08-01",
    author: { name: "Alex Kim", avatar: "/placeholder.svg" }
  },
  {
    id: "102",
    title: "Understanding Async/Await in JavaScript",
    slug: "understanding-async-await-in-javascript",
    description: "A beginner's guide to mastering async programming in JS.",
    tag: "Tech",
    visibility: "public",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    createdAt: "2024-08-02",
    author: { name: "Priya S.", avatar: "/placeholder.svg" }
  },
  {
    id: "103",
    title: "Work-Life Balance for Remote Engineers",
    slug: "work-life-balance-for-remote-engineers",
    description: "How to set boundaries and thrive while working remotely.",
    tag: "Life",
    visibility: "public",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    createdAt: "2024-08-03",
    author: { name: "Maria L.", avatar: "/placeholder.svg" }
  },
];

const trendingTags = ["Productivity", "Tech", "Life", "React", "Career"];
const suggestedUsers = [
  { name: "Jane Doe", avatar: "/placeholder.svg" },
  { name: "John Smith", avatar: "/placeholder.svg" },
  { name: "Priya S.", avatar: "/placeholder.svg" },
];

export default function HomePage() {
  const [feed, setFeed] = useState(mockFeedNotes);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Main Feed */}
        <main className="md:col-span-3">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Community Feed</h2>
          <div className="bg-white rounded-lg border border-gray-200">
            {feed.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No notes to display</div>
            ) : (
              feed.map((note) => <NoteCard key={note.id} note={note} showVisibility={true} />)
            )}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Trending Tags */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Trending Tags</h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200">#{tag}</span>
              ))}
            </div>
          </div>
          {/* Suggested Users */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Suggested Users</h3>
            <div className="space-y-3">
              {suggestedUsers.map((user) => (
                <div key={user.name} className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-gray-200" />
                  <span className="text-sm text-gray-800 font-medium">{user.name}</span>
                  <Button size="sm" className="ml-auto">Follow</Button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
