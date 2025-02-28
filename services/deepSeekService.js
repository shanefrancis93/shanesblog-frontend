const axios = require('axios');

class DeepSeekService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.deepseek.com/v1',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async generateBlogDraft(tweets) {
    try {
      const prompt = this.createPromptFromTweets(tweets);
      const response = await this.client.post('/generate', {
        model: 'deepseek-chat',  // adjust based on actual model name
        messages: [
          {
            role: 'system',
            content: 'You are a professional blog writer. Convert the provided tweets into a coherent blog post.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating blog draft:', error);
      throw error;
    }
  }

  createPromptFromTweets(tweets) {
    const tweetTexts = tweets.map(tweet => tweet.text).join('\n\n');
    return `Please create a well-structured blog post based on the following tweets. Maintain the original message and tone while expanding on the ideas:\n\n${tweetTexts}`;
  }
}

module.exports = DeepSeekService; 