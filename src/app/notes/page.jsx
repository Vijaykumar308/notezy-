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
  const { isAuthenticated } = useAuth();
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
        
        // Fetch notes
        const notesResponse = await fetch('/api/notes');
        const notesData = await notesResponse.json();
        
        if (!notesResponse.ok) {
          throw new Error(notesData.message || 'Failed to fetch notes');
        }
        
        setNotes(notesData.data || []);
        
        // Fetch tags
        const tagsResponse = await fetch('/api/tags');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Notes</h1>
          <p className="text-muted-foreground">
            {activeTab === 'all' && 'All your notes in one place'}
            {activeTab === 'pinned' && 'Your pinned notes'}
            {activeTab === 'archived' && 'Archived notes'}
            {activeTab === 'public' && 'Public notes'}
          </p>
        </div>
        
        <Button onClick={() => router.push('/notes/new')} className="gap-2">
          <Icons.plus className="h-4 w-4" />
          New Note
        </Button>
      </div>
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2"
            >
              <Icons.filter className="h-4 w-4" />
              Filters
              {selectedTags.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                  {selectedTags.length}
                </span>
              )}
            </Button>
            
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 p-4 bg-card border rounded-md shadow-lg z-10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Filter by Tags</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTags([])}
                    disabled={selectedTags.length === 0}
                  >
                    Clear
                  </Button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {availableTags.map(tag => (
                    <div key={tag._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`tag-${tag._id}`}
                        checked={selectedTags.includes(tag._id)}
                        onChange={() => handleTagToggle(tag._id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label 
                        htmlFor={`tag-${tag._id}`} 
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
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
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pinned" className="flex items-center gap-1">
              <Icons.pin className="h-3.5 w-3.5" />
              Pinned
            </TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            {(searchQuery || selectedTags.length > 0) && (
              <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">
                  {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
                  {searchQuery && ` for "${searchQuery}"`}
                  {selectedTags.length > 0 && (
                    <>
                      {' with tags: '}
                      {selectedTags.map((tagId, index) => {
                        const tag = availableTags.find(t => t._id === tagId);
                        return (
                          <span key={tagId} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mx-1">
                            {tag?.name || tagId}
                          </span>
                        );
                      })}
                    </>
                  )}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-8 px-2"
                >
                  Clear filters
                </Button>
              </div>
            )}
            
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Icons.note className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notes found</h3>
                <p className="text-muted-foreground mt-2">
                  {searchQuery || selectedTags.length > 0
                    ? 'Try adjusting your search or filter criteria.'
                    : activeTab === 'pinned'
                    ? 'You have no pinned notes yet.'
                    : activeTab === 'archived'
                    ? 'Your archived notes will appear here.'
                    : 'Create your first note to get started.'}
                </p>
                {!searchQuery && selectedTags.length === 0 && activeTab !== 'pinned' && activeTab !== 'archived' && (
                  <Button 
                    onClick={() => router.push('/notes/new')} 
                    className="mt-4"
                  >
                    <Icons.plus className="h-4 w-4 mr-2" />
                    Create Note
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note) => (
                  <div
                    key={note._id}
                    className="relative group border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/notes/${note._id}`)}
                    style={{
                      backgroundColor: note.color || 'white',
                      borderColor: note.color ? `${note.color}40` : 'hsl(var(--border))',
                    }}
                  >
                    {note.isPinned && (
                      <Icons.pin className="absolute top-2 right-2 h-4 w-4 text-muted-foreground" />
                    )}
                    
                    <h3 className="font-medium line-clamp-1 mb-1">
                      {note.title || 'Untitled Note'}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {note.content.replace(/[#*_`~>\[\]]/g, '')}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {note.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={typeof tag === 'string' ? tag : tag._id}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {typeof tag === 'string' ? tag : tag.name}
                        </span>
                      ))}
                      {note.tags?.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                      <span>{formatDate(note.updatedAt || note.createdAt)}</span>
                      {note.isPublic && (
                        <span className="flex items-center">
                          <Icons.eye className="h-3 w-3 mr-1" />
                          Public
                        </span>
                      )}
                    </div>
                    
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity" />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
