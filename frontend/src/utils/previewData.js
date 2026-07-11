// Temporary visual-preview mode: lets the UI be reviewed without a backend.
// Trigger with ?preview=1 in the URL. Safe to delete this file plus the
// PREVIEW_MODE branch in api.js and App.jsx once the redesign is approved.

export const PREVIEW_MODE =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("preview") === "1";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

let mockTasks = [
  { id: "1", title: "Read 20 pages", description: "Any book counts, fiction or non-fiction.", points: 10, type: "daily", status: "pending", completed_today: true },
  { id: "2", title: "Go for a 20 minute walk", description: "Get outside and move.", points: 8, type: "daily", status: "pending", completed_today: false },
  { id: "3", title: "No sugar today", description: "Skip the sweets, just for today.", points: 12, type: "daily", status: "pending", completed_today: false },
  { id: "4", title: "Finish the project proposal", description: "Ship the first draft to the team.", points: 25, type: "onetime", status: "pending", completed_today: false },
  { id: "5", title: "Meditate for 10 minutes", description: "Quiet room, no phone.", points: 6, type: "daily", status: "pending", completed_today: false },
  { id: "6", title: "Drink 8 glasses of water", description: "Track it if it helps.", points: 5, type: "daily", status: "completed", completed_today: true },
];

export const previewApi = {
  login: async () => ({ ok: true, json: async () => ({ access_token: "preview", username: "preview_user", email: "preview@example.com" }) }),
  signup: async () => ({ ok: true, json: async () => ({ access_token: "preview", username: "preview_user", email: "preview@example.com" }) }),

  getResolutions: async () => {
    await delay();
    return mockTasks;
  },

  addResolution: async (resolution) => {
    await delay();
    const task = { id: String(Date.now()), status: "pending", completed_today: false, ...resolution };
    mockTasks = [...mockTasks, task];
    return task;
  },

  completeResolution: async (id) => {
    await delay();
    mockTasks = mockTasks.map((t) => (t.id === id ? { ...t, completed_today: true } : t));
    return { message: "Task completed!", points_added: 10 };
  },

  deleteResolution: async (id) => {
    await delay();
    mockTasks = mockTasks.filter((t) => t.id !== id);
    return { message: "Task deleted successfully" };
  },

  getScore: async () => {
    await delay();
    return { total_points: 165 };
  },

  getProfile: async () => {
    await delay();
    return {
      username: "preview_user",
      email: "preview@example.com",
      total_points: 165,
      tasks_completed: 23,
      streak: 4,
      level: 2,
      about: "Trying to build better habits, one small task at a time.",
    };
  },

  getLeaderboard: async () => {
    await delay();
    return {
      leaderboard: [
        { username: "habit_hero", level: 6, total_points: 1520 },
        { username: "goal_getter", level: 5, total_points: 1180 },
        { username: "streak_master", level: 4, total_points: 940 },
        { username: "preview_user", level: 2, total_points: 165 },
        { username: "just_started", level: 1, total_points: 40 },
      ],
    };
  },

  updateAbout: async (about) => {
    await delay();
    return { success: true, about };
  },

  generateTasks: async (prompt) => {
    await delay(600);
    const tasks = [
      { id: String(Date.now()), title: `Plan: ${prompt}`.slice(0, 40), description: "A first small step toward this goal.", points: 10, type: "daily" },
      { id: String(Date.now() + 1), title: "Follow through today", description: "Just the smallest version of it.", points: 8, type: "daily" },
    ];
    mockTasks = [...mockTasks, ...tasks];
    return { success: true, message: `Created ${tasks.length} fun daily tasks!`, tasks };
  },
};
