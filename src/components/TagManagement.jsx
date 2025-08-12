import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-toastify"
import { useAuth } from "@/hooks/useAuth"

export function TagManagement() {
  const { session, loading: authLoading, token } = useAuth(true)
  const [newTag, setNewTag] = useState("")
  const [tags, setTags] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedColor, setSelectedColor] = useState("#3b82f6")
  const [isDeleting, setIsDeleting] = useState({})

  // Available color options for tags
  const colorOptions = [
    "#3b82f6", // blue
    "#ef4444", // red
    "#10b981", // emerald
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#ec4899", // pink
  ]

  // Fetch tags when component mounts and when token changes
  useEffect(() => {
    console.log('useEffect triggered - token:', token ? 'present' : 'missing');
    if (token) {
      console.log('Token available, fetching tags...');
      fetchTags();
    } else {
      console.log('No token available, clearing tags');
      setTags([]);
    }
  }, [token]) // Add token as a dependency

  const fetchTags = async () => {
    // Double-check token is available
    if (!token) {
      console.log('No token available in fetchTags, aborting');
      setTags([]);
      return;
    }

    console.log('Starting to fetch tags with token:', token.substring(0, 10) + '...');
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/tags', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include' // Important for sending cookies if using them
      });
      
      console.log('Tags API response status:', response.status);
      
      if (response.status === 401) {
        console.log('Unauthorized - redirecting to login');
        // The useAuth hook should handle the redirect
        setTags([]);
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response from tags API:', errorData);
        throw new Error(errorData.message || `Failed to fetch tags (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Tags API response data:', data);
      
      if (data.success) {
        // Make sure we have an array of tags
        const tagsArray = Array.isArray(data.data) ? data.data : [];
        console.log(`Setting ${tagsArray.length} tags`);
        setTags(tagsArray);
      } else {
        console.error('API returned success:false:', data.message);
        throw new Error(data.message || 'Failed to fetch tags');
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
      toast.error(error.message || 'Failed to load tags. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTag = async () => {
    const tagName = newTag.trim()
    if (!tagName) return
    
    if (!token) {
      toast.error('Please log in to create tags')
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: tagName,
          color: selectedColor
        }),
      })

      if (response.status === 401) {
        // The useAuth hook will handle the redirect
        toast.error('Your session has expired. Please log in again.');
        return;
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to create tag (${response.status})`);
      }

      if (data.success) {
        // Update the local state with the new tag
        setTags(prevTags => [...prevTags, data.data]);
        setNewTag('');
        toast.success('Tag created successfully');
        
        // Refresh the tags list to ensure consistency
        await fetchTags();
      }
    } catch (error) {
      console.error('Error creating tag:', error)
      toast.error(error.message || 'Failed to create tag')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTag = async (tagId) => {
    if (isDeleting[tagId] || !token) return
    
    try {
      setIsDeleting(prev => ({ ...prev, [tagId]: true }))
      
      const response = await fetch(`/api/tags?id=${tagId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })

      if (response.status === 401) {
        // The useAuth hook will handle the redirect
        toast.error('Your session has expired. Please log in again.');
        return;
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete tag')
      }

      if (data.success) {
        setTags(prevTags => prevTags.filter(tag => tag._id !== tagId))
        toast.success('Tag deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting tag:', error)
      toast.error(error.message || 'Failed to delete tag')
    } finally {
      setIsDeleting(prev => ({ ...prev, [tagId]: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Manage Tags
        </h2>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Create New Tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              disabled={isLoading}
            />
            <Button 
              onClick={handleAddTag}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !newTag.trim()}
            >
              {isLoading ? 'Adding...' : 'Add Tag'}
            </Button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-gray-500 self-center">Color:</span>
            {colorOptions.map(color => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? 'border-gray-900 dark:border-white' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          Existing Tags
        </h3>
        
        {isLoading ? (
          <div className="text-gray-500 py-2">Loading tags...</div>
        ) : tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div key={tag._id} className="relative group">
                <Badge
                  variant="secondary"
                  className={`px-3 py-1 pr-6 hover:opacity-90 transition-opacity`}
                  style={{ 
                    backgroundColor: tag.color || '#3b82f6', 
                    color: '#fff',
                    minWidth: '60px',
                    textAlign: 'center'
                  }}
                >
                  {tag.name}
                </Badge>
                <button
                  onClick={() => handleDeleteTag(tag._id)}
                  disabled={isDeleting[tag._id]}
                  className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-white/80 hover:text-white"
                  aria-label={`Delete tag ${tag.name}`}
                >
                  {isDeleting[tag._id] ? '...' : '×'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 py-2">
            No tags found. Create your first tag using the input above!
          </div>
        )}
      </div>
    </div>
  )
}
