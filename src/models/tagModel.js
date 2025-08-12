import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    lowercase: true
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  isCustom: { 
    type: Boolean, 
    default: true 
  },
  usageCount: { 
    type: Number, 
    default: 1 
  },
  color: {
    type: String,
    default: '#3b82f6' // Default blue color
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
tagSchema.index({ name: 1, createdBy: 1 }, { unique: true }); // Ensure tag names are unique per user

// Static method to find or create tags
// This will be used when creating/updating notes
tagSchema.statics.findOrCreateTags = async function(tagNames, userId) {
  if (!Array.isArray(tagNames)) {
    tagNames = [tagNames];
  }

  // Remove duplicates and convert to lowercase
  const uniqueTags = [...new Set(tagNames.map(tag => tag.trim().toLowerCase()))];
  
  // Find existing tags
  const existingTags = await this.find({
    name: { $in: uniqueTags },
    createdBy: userId
  });

  const existingTagNames = new Set(existingTags.map(tag => tag.name));
  const newTagNames = uniqueTags.filter(name => !existingTagNames.has(name));

  // Create new tags
  const newTags = await Promise.all(
    newTagNames.map(name => 
      this.create({ 
        name, 
        createdBy: userId,
        isCustom: true
      })
    )
  );

  // Increment usage count for existing tags
  if (existingTags.length > 0) {
    await this.updateMany(
      { _id: { $in: existingTags.map(tag => tag._id) } },
      { $inc: { usageCount: 1 } }
    );
  }

  return [...existingTags, ...newTags];
};

// Method to decrement usage count when a tag is removed from a note
tagSchema.statics.decrementTagUsage = async function(tagIds) {
  if (!Array.isArray(tagIds)) {
    tagIds = [tagIds];
  }

  await this.updateMany(
    { _id: { $in: tagIds } },
    { $inc: { usageCount: -1 } }
  );

  // Delete tags that are no longer in use
  await this.deleteMany({ 
    _id: { $in: tagIds },
    usageCount: { $lte: 0 },
    isCustom: true // Only delete custom tags, not system ones
  });
};

const Tag = mongoose.models.Tag || mongoose.model('Tag', tagSchema);

export default Tag;
