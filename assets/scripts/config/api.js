export const API_BASE_URL = 'http://212.85.0.237:8001';

export const API_ROUTES = {
  accessRequest: '/access-request',
};

export function buildApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export async function apiFetch(path, options = {}) {
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const msg = body?.detail || `API error ${response.status} at ${path}`;
    throw new Error(msg);
  }

  return response.json();
}
