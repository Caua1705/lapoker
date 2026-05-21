export const API_BASE_URL = 'https://api.lapoker.com.br';

export const API_ROUTES = {
  accessRequest: '/access-request',
};

export function buildApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export async function apiFetch(path, options = {}) {
  return fetch(buildApiUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}
