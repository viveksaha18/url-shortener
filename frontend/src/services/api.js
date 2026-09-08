const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === 'object' && data?.detail ? data.detail : String(data || 'Something went wrong.');
    throw new Error(message);
  }

  return data;
}

export const api = {
  register: (email, password) => request('/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  login: (email, password) => request('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  profile: (token) => request('/profile', { headers: { Authorization: `Bearer ${token}` } }),
  shorten: (url, token) => request('/url', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ url }),
  }),
};

export const shortUrl = (code) => `${API_URL}/${code}`;