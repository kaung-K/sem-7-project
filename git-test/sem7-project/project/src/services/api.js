// Simple API service for making HTTP requests
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

export async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...options,
  };

  if (options.data) {
    if (options.method === 'DELETE') {
      // For DELETE requests, send data in the body
      config.body = JSON.stringify(options.data);
    } else {
      config.body = JSON.stringify(options.data);
    }
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Network request failed');
  }
}