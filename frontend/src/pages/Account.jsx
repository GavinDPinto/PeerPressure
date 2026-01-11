import { useState, useEffect } from "react";
import { api } from "../utils/api.js";

export default function Account({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
      setAboutText(data.about || "");
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAbout = async () => {
    setSaving(true);
    try {
      await api.updateAbout(aboutText);
      setProfile({ ...profile, about: aboutText });
      setEditingAbout(false);
    } catch (error) {
      console.error("Failed to update about:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setAboutText(profile.about || "");
    setEditingAbout(false);
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Call parent logout handler
    if (onLogout) onLogout();
  };

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center">
        <p className="text-white text-xl">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-full flex justify-center items-center">
        <p className="text-white text-xl">Failed to load profile</p>
      </div>
    );
  }

  // Get user initials from username
  const initials = profile.username
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || profile.username.slice(0, 2).toUpperCase();

  return (
    <div className="h-full overflow-y-auto flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col gap-8">

        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
            {initials}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
            <p className="text-gray-400">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Stat label="Tokens" value={profile.total_points} />
          <Stat label="Tasks Completed" value={profile.tasks_completed} />
          <Stat label="Streak" value={`${profile.streak} days`} />
          <Stat label="Level" value={profile.level} />
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-white">About</h2>
            {!editingAbout && (
              <button
                onClick={() => setEditingAbout(true)}
                className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
              >
                Edit
              </button>
            )}
          </div>
          {editingAbout ? (
            <div className="space-y-3">
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveAbout}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 text-sm leading-relaxed">
              {profile.about || (
                <span className="text-gray-500 italic">Click Edit to add an about section</span>
              )}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <ProfileButton
            onClick={handleLogout}
            label="Log Out"
            danger
          />
        </div>

      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 text-center">
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}

function ProfileButton({ label, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 rounded-xl font-semibold transition ${
        danger
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-gray-700 hover:bg-gray-600 text-white"
      }`}
    >
      {label}
    </button>
  );
}
