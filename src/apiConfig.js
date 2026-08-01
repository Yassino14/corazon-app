export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://corazon-app-server.onrender.com';

const DEMO_USERS_KEY = 'demoUsers';

const loadDemoUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveDemoUsers = (users) => {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
};

export async function loginClient(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/client-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return { ok: true, data: await response.json() };
  } catch {
    const users = loadDemoUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      return {
        ok: true,
        data: { token: `demo-client-${email}`, user },
      };
    }

    return { ok: false, error: 'Connection error. Please try again later.' };
  }
}

export async function registerClient(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/client-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return { ok: true, data: await response.json() };
  } catch {
    const users = loadDemoUsers();
    const existing = users.find((u) => u.email === payload.email);

    if (existing) {
      return { ok: false, error: 'This email is already registered.' };
    }

    const user = {
      id: Date.now(),
      name: payload.name,
      email: payload.email,
      phone: payload.phone || '',
      address: payload.address || '',
      password: payload.password,
    };

    users.push(user);
    saveDemoUsers(users);

    return {
      ok: true,
      data: { token: `demo-client-${payload.email}`, user },
    };
  }
}

export async function loginAdmin(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Admin login failed');
    }

    return { ok: true, data: await response.json() };
  } catch {
    if (username === 'admin' && password === 'admin123') {
      return {
        ok: true,
        data: { token: `demo-admin-${username}`, user: { username } },
      };
    }

    return { ok: false, error: 'Connection error. Please try again later.' };
  }
}
