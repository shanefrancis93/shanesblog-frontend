const axios = require('axios');

class TweetOrganizerService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async organizeTweets(tweets) {
    try {
      const response = await this.client.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: 'You are an expert at analyzing and organizing content by themes and concepts.'
        }, {
          role: 'user',
          content: this.createOrganizationPrompt(tweets)
        }],
        temperature: 0.3 // Lower temperature for more consistent categorization
      });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error organizing tweets:', error);
      throw error;
    }
  }

  createOrganizationPrompt(tweets) {
    const tweetTexts = tweets.map(tweet => tweet.text).join('\n\n');
    return `Analyze these tweets and organize them into coherent themes or topics. 
    For each theme:
    1. Identify the main concept
    2. Group related tweets
    3. Provide brief context about how they connect
    
    Return the result as a JSON object with this structure:
    {
      "themes": [{
        "name": "Theme name",
        "description": "Brief theme description",
        "tweets": ["tweet1", "tweet2"],
        "context": "How these tweets relate to each other"
      }]
    }

    Tweets to analyze:
    ${tweetTexts}`;
  }
}

module.exports = TweetOrganizerService; 