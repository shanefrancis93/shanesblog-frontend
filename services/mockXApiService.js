class MockXApiService {
  async getUserId(username) {
    // Always return your user ID for testing
    return '1760830165272416256';
  }

  async getUserTweets(username) {
    // Return some fake tweets for testing
    return {
      data: [
        {
          id: '1',
          text: 'This is a test tweet about AI',
          created_at: '2024-01-31T00:00:00Z'
        },
        {
          id: '2',
          text: 'Another test tweet about development',
          created_at: '2024-01-31T01:00:00Z'
        },
        {
          id: '3',
          text: 'Mock tweet about coding',
          created_at: '2024-01-31T02:00:00Z'
        }
      ]
    };
  }
}

module.exports = MockXApiService; 