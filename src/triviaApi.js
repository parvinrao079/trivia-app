// src/TriviaApi.js
export async function fetchTriviaQuestions() {
    const url = 'https://the-trivia-api.com/v2/questions?limit=5'; // Limiting to 5 questions via API
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch trivia questions');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching trivia questions:', error);
      return [];
    }
  }
  