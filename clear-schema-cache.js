// Clear MongoDB schema cache
const mongoose = require('mongoose');

// Delete all cached models
Object.keys(mongoose.models).forEach(modelName => {
  delete mongoose.models[modelName];
});

// Clear the schema registry
mongoose.modelSchemas = {};

console.log('MongoDB schema cache cleared');
