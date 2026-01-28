// src/services/nyayaLM.js

const API_URL = 'https://paleoentomological-sordidly-india.ngrok-free.dev';

export const askNyayaLM = async (question) => {
  try {
    const response = await fetch(`${API_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling NyayaLM API:', error);
    throw error;
  }
};