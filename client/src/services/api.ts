export const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

interface FetchOptions extends RequestInit {
  data?: any;
}

export const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
  const token = localStorage.getItem('depayhub_token');
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (options.data && !(options.data instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    options.body = JSON.stringify(options.data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type');
  let result;
  if (contentType && contentType.includes('application/json')) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  if (!response.ok) {
    throw new Error((result && result.error) || response.statusText || 'API Error');
  }

  return result;
};
