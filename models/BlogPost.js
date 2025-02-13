const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  sourceTweets: [{
    id: String,
    text: String,
    createdAt: Date
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  author: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BlogPost', blogPostSchema); 