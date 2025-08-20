// This file ensures all models are loaded and registered with Mongoose
import './userModel';
import './noteModel';
import './tagModel';

// This ensures all models are registered before they're used
console.log('All models have been registered');
