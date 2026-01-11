const API_BASE = "http://localhost:8000";

// Get JWT token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic fetch wrapper with auth
export const apiFetch = async (endpoint, options = {}) => {
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  // If unauthorized, clear storage and redirect to login
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
    throw new Error("Unauthorized");
  }

  return response;
};

// API methods
export const api = {
  // Auth
  login: async (username, password) => {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return response;
  },

  signup: async (username, email, password) => {
    const response = await fetch(`${API_BASE}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    return response;
  },

  // Resolutions
  getResolutions: async () => {
    const response = await apiFetch("/api/resolutions");
    return response.json();
  },

  addResolution: async (resolution) => {
    const response = await apiFetch("/api/resolutions", {
      method: "POST",
      body: JSON.stringify(resolution),
    });
    return response.json();
  },

  completeResolution: async (id) => {
    const response = await apiFetch(`/api/resolutions/${id}/complete`, {
      method: "PUT",
    });
    return response.json();
  },

  // Score
  getScore: async () => {
    const response = await apiFetch("/api/score");
    return response.json();
  },

  // Profile
  getProfile: async () => {
    const response = await apiFetch("/api/profile");
    return response.json();
  },

  updateAbout: async (about) => {
    const response = await apiFetch("/api/profile/about", {
      method: "PUT",
      body: JSON.stringify({ about }),
    });
    return response.json();
  },
};
