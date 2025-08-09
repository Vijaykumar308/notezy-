"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit3, Share2, Trash2, Heart, Bookmark, MoreHorizontal, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NoteReadingPage = ({ note }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Sample note data if none provided
  const defaultNote = {
    id: 1,
    title: "The Art of Mindful Living",
    content: `Mindful living is about being fully present in the moment, aware of your thoughts and feelings without judgment. It's a practice that can reduce stress, improve focus, and enhance overall well-being. Start by incorporating small moments of mindfulness into your day, such as focusing on your breath or savoring each bite of food. Over time, these moments can grow into a more mindful way of life.

The practice of mindfulness has its roots in ancient Buddhist traditions, but it has been adapted for modern life and backed by scientific research. Studies show that regular mindfulness practice can lead to structural changes in the brain, particularly in areas associated with learning, memory, and emotional regulation.

Here are some simple ways to begin your mindfulness journey:

1. **Morning Meditation**: Start your day with 5-10 minutes of quiet reflection
2. **Mindful Eating**: Pay attention to the taste, texture, and aroma of your food
3. **Walking Meditation**: Take slow, deliberate steps while focusing on your surroundings
4. **Gratitude Practice**: End each day by reflecting on three things you're grateful for

Remember, mindfulness is not about emptying your mind or achieving a state of eternal calm. It's about developing a different relationship with your thoughts and emotions, observing them with curiosity rather than judgment.`,
    author: {
      name: "Sophia Bennett",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      initials: "SB"
    },
    publishedDate: "Jan 15, 2024",
    readTime: "5 min read",
    category: "Wellness",
    tags: ["mindfulness", "wellness", "meditation", "lifestyle"],
    likes: 42,
    bookmarks: 18
  };

  const currentNote = note || defaultNote;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Note Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <Avatar className="w-14 h-14">
              <AvatarImage src={currentNote.author?.avatar || "/placeholder.svg"} alt={currentNote.author?.name} />
              <AvatarFallback>{currentNote.author?.initials || currentNote.author?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/profile/${encodeURIComponent(currentNote.author?.name || '')}`} className="font-semibold text-lg text-gray-900 hover:text-blue-600 hover:underline">
                  {currentNote.author?.name}
                </Link>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{currentNote.publishedDate}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{currentNote.readTime}</span>
              </div>
              <div className="mt-1">
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {currentNote.category}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`${isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="ml-1 text-sm">{currentNote.likes + (isLiked ? 1 : 0)}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`${isBookmarked ? 'text-blue-500 hover:text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="ml-1 text-sm">{currentNote.bookmarks + (isBookmarked ? 1 : 0)}</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex items-center">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Note
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Note
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentNote.title}</h1>
        {currentNote.description && (
          <p className="text-lg text-gray-700 mb-6">{currentNote.description}</p>
        )}
        <div className="prose prose-lg max-w-none mb-8">
          {currentNote.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('#')) {
              return (
                <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  {paragraph.replace(/^#+\s/, '')}
                </h2>
              );
            } else if (paragraph.match(/^\d+\./)) {
              const items = paragraph.split(/\d+\.\s/).filter(item => item.trim());
              return (
                <ol key={index} className="list-decimal list-inside space-y-2 my-6">
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-700 leading-relaxed">
                      {item.includes('**') ? (
                        <span>
                          <strong className="font-semibold text-gray-900">
                            {item.split('**')[1]}
                          </strong>
                          {item.split('**')[2]}
                        </span>
                      ) : (
                        item
                      )}
                    </li>
                  ))}
                </ol>
              );
            } else {
              return (
                <p key={index} className="text-gray-700 leading-relaxed mb-6 text-lg">
                  {paragraph}
                </p>
              );
            }
          })}
        </div>

        {/* Tags */}
        <div className="flex items-center space-x-2 mb-8">
          <span className="text-sm font-medium text-gray-500">Tags:</span>
          <div className="flex flex-wrap gap-2">
            {currentNote.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteReadingPage;
