const axios = require('axios');
const fs = require('fs');
const path = require('path');

class XApiService {
  constructor() {
    this.baseURL = 'https://api.twitter.com/2';
    this.headers = {
      'Authorization': `Bearer ${process.env.X_BEARER_TOKEN}`,
      'Content-Type': 'application/json'
    };
  }

  async handleRateLimit(error) {
    if (error.response?.status === 429) {
      const resetTime = error.response.headers['x-rate-limit-reset'];
      const waitTime = (resetTime * 1000) - Date.now();
      const minutes = Math.ceil(waitTime / 60000);
      const seconds = Math.ceil(waitTime / 1000);
      
      console.log(`Rate limited. Reset in ${minutes} minutes and ${seconds % 60} seconds`);
      console.log(`Current time: ${new Date().toLocaleTimeString()}`);
      console.log(`Reset time: ${new Date(resetTime * 1000).toLocaleTimeString()}`);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return true;
    }
    return false;
  }

  async getUserId(username) {
    console.log(`Getting user ID for: ${username}`);
    try {
      const response = await axios.get(
        `${this.baseURL}/users/by/username/${username}`,
        { headers: this.headers }
      );
      return response.data.data.id;
    } catch (error) {
      if (await this.handleRateLimit(error)) {
        return this.getUserId(username); // Retry after waiting
      }
      console.error('Failed to get user ID:', error.response?.data || error.message);
      throw error;
    }
  }

  async saveTweetsToFile(tweets, filename = 'tweets.md') {
    const outputPath = path.join(__dirname, '..', 'data', filename);
    
    // Ensure data directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Sort tweets by creation date (newest first)
    const sortedTweets = [...tweets.data].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    const content = sortedTweets.map(tweet => {
      const date = new Date(tweet.created_at).toLocaleString();
      return `## ${date} | topic = []\n${tweet.text}\n\n---\n`;
    }).join('\n');

    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`Saved ${tweets.data.length} tweets to ${outputPath}`);
  }

  async getUserTweets(daysBack = null) {
    const userId = '1760830165272416256';  // Hardcoded your ID
    console.log(`Fetching tweets for user ID: ${userId}`);
    
    // Calculate today's date range in UTC
    const now = new Date();
    const startTime = new Date(now.setHours(0,0,0,0)).toISOString();
    const endTime = new Date().toISOString();
    
    console.log('Request parameters:', {
      userId,
      startTime,
      endTime
    });

    try {
      const response = await axios.get(
        `${this.baseURL}/users/${userId}/tweets`,
        {
          headers: this.headers,
          params: {
            max_results: 100,
            'tweet.fields': 'created_at,referenced_tweets',
            start_time: startTime,
            end_time: endTime,
            exclude: 'retweets'  // Always exclude retweets, keep replies
          }
        }
      );

      // Debug logging
      console.log('API Response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      const tweets = response.data.data || [];
      console.log(`Found ${tweets.length} tweets/replies`);

      const result = {
        data: tweets,
        meta: { total_tweets: tweets.length }
      };

      await this.saveTweetsToFile(result, 'all_tweets.md');
      return result;
    } catch (error) {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (await this.handleRateLimit(error)) {
        return this.getUserTweets(daysBack);
      }
      throw error;
    }
  }
}

module.exports = XApiService; 