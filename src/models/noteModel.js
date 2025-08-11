import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'],
    trim: true
  },
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  tags: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tag',
    default: []
  }],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#ffffff' // Default white background
  },
  // For soft delete functionality
  isArchived: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
noteSchema.index({ createdBy: 1, isArchived: 1 });
noteSchema.index({ tags: 1 });
noteSchema.index({ isPublic: 1 });
noteSchema.index({ isPinned: -1, updatedAt: -1 });

// Virtual for formatted dates
noteSchema.virtual('createdAtFormatted').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Pre-save hook to update lastEditedBy
noteSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.lastEditedBy = this.createdBy; // In a real app, this would be the current user
  }
  next();
});

// Pre-remove hook to handle tag cleanup
noteSchema.pre('remove', async function(next) {
  try {
    // Decrement tag usage counts
    if (this.tags && this.tags.length > 0) {
      const Tag = mongoose.model('Tag');
      await Tag.decrementTagUsage(this.tags);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to create a new note with tags
noteSchema.statics.createWithTags = async function(noteData, userId) {
  const Tag = mongoose.model('Tag');
  const { tags = [], ...noteFields } = noteData;
  
  // Create or get tags
  const tagDocuments = tags.length > 0 
    ? await Tag.findOrCreateTags(tags, userId)
    : [];
  
  // Create the note with tag references
  const note = new this({
    ...noteFields,
    tags: tagDocuments.map(tag => tag._id),
    createdBy: userId
  });

  return note.save();
};

// Instance method to update note with tags
noteSchema.methods.updateWithTags = async function(updateData, userId) {
  const Tag = mongoose.model('Tag');
  const { tags, ...otherUpdates } = updateData;
  
  // Update basic fields
  Object.assign(this, otherUpdates);
  
  // If tags are being updated
  if (tags) {
    // Decrement usage for old tags
    if (this.tags && this.tags.length > 0) {
      await Tag.decrementTagUsage(this.tags);
    }
    
    // Create or get new tags
    const tagDocuments = tags.length > 0 
      ? await Tag.findOrCreateTags(tags, userId)
      : [];
    
    this.tags = tagDocuments.map(tag => tag._id);
  }
  
  this.lastEditedBy = userId;
  return this.save();
};

const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);

export default Note;
