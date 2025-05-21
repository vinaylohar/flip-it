import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { Utils } from '../config/utils';

const apiClient = axios.create({
  baseURL: API_BASE_URL, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include playerFBId in all requests
apiClient.interceptors.request.use((config) => {
  const playerFBId = Utils.getPlayerFBIdFromLocalStorage() // Retrieve playerFBId from localStorage
  if (playerFBId) {
    config.headers['playerFBId'] = playerFBId;
  }
  return config;
});

export default apiClient;