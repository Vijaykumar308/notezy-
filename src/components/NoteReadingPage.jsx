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
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Notes
                </Button>
              </Link>
              <div className="text-sm text-gray-500">
                <span className="hover:text-gray-700 cursor-pointer">Notes</span>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">Reading Note</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`${isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="ml-1 text-sm">{currentNote.likes + (isLiked ? 1 : 0)}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`${isBookmarked ? 'text-blue-500 hover:text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
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
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-8 border-b border-gray-100">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {currentNote.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {currentNote.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={currentNote.author.avatar} alt={currentNote.author.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {currentNote.author.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{currentNote.author.name}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Published on {currentNote.publishedDate}
                    </span>
                    <span>•</span>
                    <span>{currentNote.readTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="flex items-center text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="prose prose-lg max-w-none">
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
          </div>

          {/* Tags */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {currentNote.tags.map((tag, index) => (
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
        </article>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit This Note
          </Button>
          <Button variant="outline" className="px-8">
            <Share2 className="w-4 h-4 mr-2" />
            Share Note
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoteReadingPage;
