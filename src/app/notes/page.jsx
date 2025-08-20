'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { useAuth } from '@/contexts/AuthContext';

export default function NotesPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/notes');
    }
  }, [isAuthenticated, router]);

  // Fetch notes and tags
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch notes with authorization
        const notesResponse = await fetch('/api/notes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const notesData = await notesResponse.json();
        
        if (!notesResponse.ok) {
          throw new Error(notesData.message || 'Failed to fetch notes');
        }
        
        setNotes(notesData.data || []);
        
        // Fetch tags with authorization
        const tagsResponse = await fetch('/api/tags', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const tagsData = await tagsResponse.json();
        
        if (tagsResponse.ok) {
          setAvailableTags(tagsData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.message || 'Failed to load notes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Filter notes based on search query, active tab, and selected tags
  useEffect(() => {
    let result = [...notes];
    
    // Filter by active tab
    if (activeTab === 'pinned') {
      result = result.filter(note => note.isPinned);
    } else if (activeTab === 'archived') {
      result = result.filter(note => note.isArchived);
    } else if (activeTab === 'public') {
      result = result.filter(note => note.isPublic);
    } else {
      // Default: show all non-archived notes
      result = result.filter(note => !note.isArchived);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        note =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          (note.tags && note.tags.some(tag => 
            typeof tag === 'string' 
              ? tag.toLowerCase().includes(query)
              : tag.name.toLowerCase().includes(query)
          ))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      result = result.filter(note => 
        note.tags && selectedTags.every(tagId =>
          note.tags.some(noteTag => 
            typeof noteTag === 'string' 
              ? noteTag === tagId 
              : noteTag._id === tagId
          )
        )
      );
    }
    
    setFilteredNotes(result);
  }, [notes, searchQuery, activeTab, selectedTags]);

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setActiveTab('all');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative
          w-16 h-16
          rounded-full
          bg-gradient-to-r from-primary to-purple-600
          animate-spin
          flex items-center justify-center
          before:content-['']
          before:absolute
          before:inset-2
          before:rounded-full
          before:bg-background
        ">
          <Icons.loader2 className="h-6 w-6 text-primary animate-spin-slow" />
        </div>
        <p className="mt-4 text-muted-foreground">Loading your notes...</p>
      </div>
    );
  }

  // Format date to relative time (e.g., "2h ago", "3d ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    
    if (diffInSeconds < minute) return 'Just now';
    if (diffInSeconds < hour) return `${Math.floor(diffInSeconds / minute)}m ago`;
    if (diffInSeconds < day) return `${Math.floor(diffInSeconds / hour)}h ago`;
    if (diffInSeconds < week) return `${Math.floor(diffInSeconds / day)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Your Notes
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeTab === 'all' && 'All your notes in one place'}
              {activeTab === 'pinned' && 'Your pinned notes'}
              {activeTab === 'archived' && 'Archived notes'}
              {activeTab === 'public' && 'Public notes from you and others'}
            </p>
          </div>
          
          <Button 
            onClick={() => router.push('/notes/create')} 
            className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all"
          >
            <Icons.plus className="h-4 w-4" />
            New Note
          </Button>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row gap-3">
          <div className="relative flex-1">
            <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes, tags, or content..."
              className="pl-10 w-full h-11 rounded-xl border-muted-foreground/20 bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2 h-11 rounded-xl border-muted-foreground/20 bg-muted/50 hover:bg-muted/80"
            >
              <Icons.filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {selectedTags.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                  {selectedTags.length}
                </span>
              )}
            </Button>
            
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-72 p-4 bg-card border border-border/50 rounded-xl shadow-2xl z-10 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-foreground">Filter by Tags</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTags([])}
                    disabled={selectedTags.length === 0}
                    className="h-8 px-2 text-sm text-primary hover:bg-primary/10"
                  >
                    Clear all
                  </Button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                  {availableTags.map(tag => (
                    <div key={tag._id} className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <input
                        type="checkbox"
                        id={`tag-${tag._id}`}
                        checked={selectedTags.includes(tag._id)}
                        onChange={() => handleTagToggle(tag._id)}
                        className="h-4 w-4 rounded border-muted-foreground/30 text-primary focus:ring-2 focus:ring-primary/50"
                      />
                      <label 
                        htmlFor={`tag-${tag._id}`} 
                        className="ml-3 text-sm font-medium text-foreground cursor-pointer select-none"
                      >
                        {tag.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="inline-flex h-10 items-center justify-center rounded-xl bg-muted/50 p-1 text-muted-foreground">
            <TabsTrigger 
              value="all" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <Icons.layoutGrid className="h-4 w-4 mr-2" />
              All
            </TabsTrigger>
            <TabsTrigger 
              value="pinned" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <Icons.pin className="h-3.5 w-3.5 mr-1.5" />
              Pinned
            </TabsTrigger>
            <TabsTrigger 
              value="public" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <Icons.globe className="h-3.5 w-3.5 mr-1.5" />
              Public
            </TabsTrigger>
            <TabsTrigger 
              value="archived" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <Icons.archive className="h-3.5 w-3.5 mr-1.5" />
              Archived
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            {/* Search and filter info bar */}
            {(searchQuery || selectedTags.length > 0) && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground/80">
                    {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
                    {searchQuery && (
                      <span className="ml-1.5">
                        matching "<span className="font-semibold text-foreground">{searchQuery}</span>"
                      </span>
                    )}
                  </p>
                  
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 sm:mt-0">
                      <span className="text-sm text-muted-foreground">with tags:</span>
                      {selectedTags.map((tagId) => {
                        const tag = availableTags.find(t => t._id === tagId);
                        return (
                          <span 
                            key={tagId}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                          >
                            {tag?.name || tagId}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTagToggle(tagId);
                              }}
                              className="ml-1.5 -mr-1 p-0.5 rounded-full hover:bg-primary/20"
                            >
                              <Icons.x className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="mt-2 sm:mt-0 h-8 px-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Icons.x className="h-3.5 w-3.5 mr-1.5" />
                  Clear all
                </Button>
              </div>
            )}
            
            {/* Empty state */}
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-muted/30 border border-dashed border-border">
                <div className="p-3.5 mb-4 rounded-full bg-primary/10">
                  <Icons.note className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1.5">
                  {searchQuery || selectedTags.length > 0
                    ? 'No matching notes found'
                    : activeTab === 'pinned'
                    ? 'No pinned notes'
                    : activeTab === 'archived'
                    ? 'No archived notes'
                    : 'No notes yet'}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchQuery || selectedTags.length > 0
                    ? 'Try adjusting your search or filter criteria.'
                    : activeTab === 'pinned'
                    ? 'Pin important notes to find them here later.'
                    : activeTab === 'archived'
                    ? 'Your archived notes will appear here.'
                    : 'Create your first note to get started.'}
                </p>
                {!searchQuery && selectedTags.length === 0 && activeTab !== 'pinned' && activeTab !== 'archived' && (
                  <Button 
                    onClick={() => router.push('/notes/create')} 
                    className="mt-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all"
                  >
                    <Icons.plus className="h-4 w-4 mr-2" />
                    Create your first note
                  </Button>
                )}
              </div>
            ) : (
              /* Notes Grid */
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredNotes.map((note) => {
                  // Extract text content from markdown
                  const textContent = note.content
                    .replace(/[#*_`~>\[\]]/g, '')
                    .replace(/\n/g, ' ')
                    .trim();
                  
                  // Get first 2-3 lines of content
                  const previewText = textContent.length > 120 
                    ? textContent.substring(0, 120) + '...' 
                    : textContent;
                  
                  return (
                    <div
                      key={note._id}
                      className="group relative flex flex-col h-full rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                      onClick={() => router.push(`/notes/${note._id}`)}
                      style={{
                        '--note-color': note.color || 'hsl(var(--card))',
                        backgroundColor: note.color ? `${note.color}15` : 'hsl(var(--card))',
                        borderColor: note.color ? `${note.color}30` : 'hsl(var(--border))',
                      }}
                    >
                      {/* Note header */}
                      <div className="p-5 pb-0">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-foreground line-clamp-2 leading-snug">
                            {note.title || 'Untitled Note'}
                          </h3>
                          
                          <div className="flex items-center space-x-1.5">
                            {note.isPinned && (
                              <span className="p-1.5 rounded-full bg-primary/10 text-primary">
                                <Icons.pin className="h-3.5 w-3.5" />
                              </span>
                            )}
                            <button 
                              className="p-1.5 rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted/50 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Add note actions (pin, archive, etc.)
                              }}
                            >
                              <Icons.moreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Note content preview */}
                        {textContent && (
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            {previewText}
                          </p>
                        )}
                      </div>
                      
                      {/* Tags */}
                      {note.tags?.length > 0 && (
                        <div className="px-5 pb-3 -mt-1 flex flex-wrap gap-1.5">
                          {note.tags.slice(0, 3).map((tag) => (
                            <span
                              key={typeof tag === 'string' ? tag : tag._id}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border/30"
                            >
                              {typeof tag === 'string' ? tag : tag.name}
                            </span>
                          ))}
                          {note.tags.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border/30">
                              +{note.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Footer */}
                      <div className="mt-auto px-5 py-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <span className="flex items-center">
                            {formatRelativeTime(note.updatedAt || note.createdAt)}
                          </span>
                          
                          {note.isPublic && (
                            <span className="flex items-center ml-3">
                              <Icons.globe className="h-3 w-3 mr-1" />
                              <span className="hidden sm:inline">Public</span>
                            </span>
                          )}
                        </div>
                        
                        <div className="flex -space-x-1.5">
                          {/* Placeholder for collaborator avatars */}
                          {note.isPublic && (
                            <div className="h-5 w-5 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center">
                              <Icons.users className="h-2.5 w-2.5 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
