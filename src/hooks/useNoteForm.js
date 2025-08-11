import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const useNoteForm = (initialData = null) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: false,
    isPinned: false,
    color: '#ffffff',
    tags: []
  });

  // Load note data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        isPublic: initialData.isPublic || false,
        isPinned: initialData.isPinned || false,
        color: initialData.color || '#ffffff',
        tags: initialData.tags?.map(tag => tag._id) || []
      });
      setTags(initialData.tags || []);
    }
  }, [initialData]);

  // Load available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        console.log('Fetching tags...');
        const response = await fetch('/api/tags', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          cache: 'no-store' // Prevent caching issues
        });
        
        console.log('Tags response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch tags: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Tags data:', data);
        
        if (data.success) {
          setAvailableTags(data.data || []);
        } else {
          console.error('API returned success:false', data);
          throw new Error(data.message || 'Failed to load tags');
        }
      } catch (error) {
        console.error('Error in fetchTags:', error);
        toast.error(error.message || 'Failed to load tags');
      }
    };

    fetchTags();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagChange = (selectedTags) => {
    setFormData(prev => ({
      ...prev,
      tags: selectedTags.map(tag => tag.value)
    }));
    setTags(selectedTags);
  };

  const createTag = async (tagName) => {
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending cookies with the request
        body: JSON.stringify({ name: tagName })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create tag');
      }
      
      setAvailableTags(prev => [...prev, data.data]);
      return data.data;
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error(error.message || 'Failed to create tag');
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      setIsLoading(false);
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Content is required');
      setIsLoading(false);
      return;
    }

    try {
      const url = initialData 
        ? `/api/notes/${initialData._id}`
        : '/api/notes';
      
      const method = initialData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending cookies with the request
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.map(tag => typeof tag === 'string' ? tag : tag._id)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      toast.success(initialData ? 'Note updated successfully' : 'Note created successfully');
      
      // Redirect to notes list or update local state if needed
      if (!initialData) {
        router.push('/notes');
      } else {
        // If you want to update the note in a parent component
        return data.data;
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error(error.message || 'Failed to save note');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    isLoading,
    tags,
    availableTags,
    handleTagChange,
    createTag
  };
};

export default useNoteForm;
