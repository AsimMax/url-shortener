import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export async function shortenUrl(url, customCode) {
  const { data } = await client.post('/api/shorten', { url, customCode });
  return data;
}

export async function fetchRecentUrls() {
  const { data } = await client.get('/api/urls');
  return data;
}

export default client;
