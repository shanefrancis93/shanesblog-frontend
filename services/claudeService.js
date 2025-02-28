const axios = require('axios');

class ClaudeService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.anthropic.com/v1',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    });
  }

  async generateBlogDraft(tweets) {
    try {
      const response = await this.client.post('/messages', {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: this.createPromptFromTweets(tweets)
        }]
      });
      return response.data.content[0].text;
    } catch (error) {
      console.error('Error generating blog draft:', error);
      throw error;
    }
  }

  createPromptFromTweets(tweets) {
    const tweetTexts = tweets.map(tweet => tweet.text).join('\n\n');
    return `You are a professional blog writer. Create a well-structured, engaging blog post based on these tweets. 
    Maintain the original message and tone while expanding on the ideas and adding relevant context:

    Tweets:
    ${tweetTexts}

    Please format the blog post with:
    1. An engaging title
    2. Clear introduction
    3. Well-organized body paragraphs
    4. Proper conclusion`;
  }
}

module.exports = ClaudeService; 