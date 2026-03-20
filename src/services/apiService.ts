export const API_BASE_URL = '/api';

type LoginPayload = {
  username: string;
  password: string;
};

type TokenResponse = {
  access: string;
  refresh: string;
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...((options.headers as Record<string, string>) || {}),
  };
  return fetch(url, { ...options, headers });
};

export const authApi = {
  async login(payload: LoginPayload): Promise<TokenResponse> {
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = (await response.json()) as TokenResponse;
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  },
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  getAccessToken() {
    return localStorage.getItem('access_token');
  },
  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  },
};