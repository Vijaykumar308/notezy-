"use client"

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { AboutSection } from "@/components/AboutSection"
import { NotesSection } from "@/components/NotesSection"
import { ProfileHeader } from "@/components/ProfileHeader"
import { ProfileTabs } from "@/components/ProfileTabs"

// Mock data - in a real app, this would come from an API
const mockUser = {
  id: "sophia-bennett",
  name: "Sophia Bennett",
  avatar: "/professional-woman-developer.png",
  bio: "Software Engineer | Sharing my thoughts on tech, productivity, and life.",
  joinDate: "2021",
  location: "San Francisco, CA",
  website: "https://sophiabennett.dev",
  interests: ["Software Development", "AI/ML", "Productivity", "Work-Life Balance"]
}

const mockCurrentUser = {
  id: "current-user",
  name: "Current User",
  avatar: "/diverse-user-avatars.png"
}

const mockNotes = [
  {
    id: "1",
    title: "The Future of AI in Software Development",
    description: "Exploring how AI tools are reshaping the software development landscape, enhancing productivity, and changing the roles of developers.",
    tag: "Tech",
    visibility: "public",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80", // AI/Software themed image
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Time Management Techniques for Developers",
    description: "Effective strategies for managing time, prioritizing tasks, and avoiding burnout in a fast-paced development environment.",
    tag: "Productivity",
    visibility: "public",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", // Clock/calendar/workspace image
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    title: "Balancing Work and Life as a Software Engineer",
    description: "Personal insights on maintaining a healthy work-life balance while pursuing a career in software engineering.",
    tag: "Life",
    visibility: "followers",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80", // Work-life balance themed image
    createdAt: "2024-01-05"
  },
  {
    id: "4",
    title: "My Private Development Notes",
    description: "Personal notes and thoughts on various development topics that I keep for my own reference.",
    tag: "Personal",
    visibility: "private",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80", // Developer notes themed image
    createdAt: "2024-01-01"
  }
];

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.userId;

  if (!userId) {
    return <div>Loading...</div>;
  }

  const [activeTab, setActiveTab] = useState("notes");
  const [isFollowing, setIsFollowing] = useState(false);
  const isOwnProfile = userId === "current-user"; // Mock logic

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <NavigationHeader currentUser={mockCurrentUser} /> */}
      
      <main className="max-w-4xl mx-auto">
        <ProfileHeader
          user={mockUser}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollowToggle={handleFollowToggle}
        />
        
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOwnProfile={isOwnProfile}
        />
        
        <div className="bg-white">
          {activeTab === "notes" && (
            <NotesSection 
              notes={mockNotes}
              isOwnProfile={isOwnProfile}
              isFollowing={isFollowing}
            />
          )}
          
          {activeTab === "about" && (
            <AboutSection user={mockUser} />
          )}
        </div>
      </main>
    </div>
  )
}
