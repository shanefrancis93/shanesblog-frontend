const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const XApiService = require('../services/xApiService');
const ClaudeService = require('../services/claudeService');
const TweetOrganizerService = require('../services/tweetOrganizerService');
const BlogPost = require('../models/BlogPost');

app.use(cors());
app.use(express.json());

// Initialize services
const xApiService = new XApiService();
const claudeService = new ClaudeService();
const tweetOrganizerService = new TweetOrganizerService();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // Keep this for faster timeout on errors
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Route to fetch user tweets
app.get('/api/tweets/:userId', async (req, res) => {
  try {
    const tweets = await xApiService.getUserTweets(req.params.userId);
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to generate blog draft from tweets
app.post('/api/generate-blog', async (req, res) => {
  try {
    const { tweets } = req.body;
    
    // First, organize tweets by theme
    const organizedContent = await tweetOrganizerService.organizeTweets(tweets);
    
    // Then, generate blog post using organized content
    const blogDraft = await claudeService.generateBlogDraft(organizedContent);
    
    res.json({ 
      draft: blogDraft,
      themes: organizedContent.themes // Include organized themes in response
    });
  } catch (error) {
    console.error('Error in blog generation pipeline:', error);
    res.status(500).json({ 
      error: error.message,
      stage: error.stage || 'unknown' // Help identify where in pipeline error occurred
    });
  }
});

// Route to save blog draft
app.post('/api/blog-posts', async (req, res) => {
  try {
    const { title, content, sourceTweets, author } = req.body;
    const blogPost = new BlogPost({
      title,
      content,
      sourceTweets,
      author
    });
    await blogPost.save();
    res.status(201).json(blogPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all blog posts
app.get('/api/blog-posts', async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get a single blog post
app.get('/api/blog-posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update a blog post
app.put('/api/blog-posts/:id', async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        content, 
        status,
        updatedAt: Date.now()
      },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this new simplified route
app.get('/api/tweets', async (req, res) => {
  try {
    console.log('Fetching tweets...');
    const tweets = await xApiService.getUserTweets();
    res.json(tweets);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message
    });
  }
});

// Add this new test route after other routes
app.post('/api/test-pipeline', async (req, res) => {
  try {
    // Step 1: Get tweets
    let tweets;
    console.log('Fetching tweets for user:', req.body.username);
    if (req.body.username) {
      const user = await xApiService.getUserByUsername(req.body.username);
      console.log('Found user:', user);
      tweets = await xApiService.getFilteredTweets(user.id, {
        minLikes: req.body.minLikes || 5,
        maxResults: req.body.maxResults || 10
      });
    } else {
      tweets = req.body.tweets || [];
    }

    if (!tweets.length) {
      return res.status(400).json({ error: 'No tweets provided or found' });
    }
    console.log('Fetched tweets:', tweets.length);

    // Step 2: Organize tweets
    console.log('Organizing tweets...');
    const organizedContent = await tweetOrganizerService.organizeTweets(tweets);
    console.log('Tweets organized');

    // Step 3: Generate blog post
    console.log('Generating blog post...');
    const blogDraft = await claudeService.generateBlogDraft(organizedContent);
    console.log('Blog post generated');

    res.json({
      originalTweets: tweets,
      organizedThemes: organizedContent.themes,
      blogDraft: blogDraft
    });

  } catch (error) {
    console.error('Pipeline test error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).json({
      error: error.message,
      stage: error.stage || 'unknown',
      details: error.response?.data || 'No additional details',
      status: error.response?.status
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 