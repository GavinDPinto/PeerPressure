import { useState, useEffect } from "react";
import { Coins, Flame, CheckCircle2, Star, LogOut, Pencil } from "lucide-react";
import { api } from "../utils/api.js";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { Textarea } from "../components/ui/Input.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { initialsFrom } from "../lib/utils.js";

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

  if (loading) {
    return (
      <Card className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (!profile) {
    return <p className="py-10 text-center text-muted">Failed to load profile</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex items-center gap-5 p-6">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full grad-brand text-2xl font-extrabold text-brand-fg shadow-(--shadow-brand)">
          {initialsFrom(profile.username)}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-extrabold">{profile.username}</h1>
          <p className="truncate text-sm text-muted">{profile.email}</p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={Coins} label="Tokens" value={profile.total_points} />
        <Stat icon={CheckCircle2} label="Completed" value={profile.tasks_completed} />
        <Stat icon={Flame} label="Streak" value={`${profile.streak}d`} />
        <Stat icon={Star} label="Level" value={profile.level} />
      </div>

      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">About</h2>
          {!editingAbout && (
            <button
              onClick={() => setEditingAbout(true)}
              className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-brand ring-focus rounded-md"
            >
              <Pencil size={14} /> Edit
            </button>
          )}
        </div>

        {editingAbout ? (
          <div className="flex flex-col gap-3">
            <Textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Tell us about yourself..."
              className="min-h-25"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveAbout} disabled={saving}>
                {saving ? <Spinner size={15} /> : "Save"}
              </Button>
              <Button size="sm" variant="secondary" onClick={handleCancelEdit} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            {profile.about || <span className="italic">Click Edit to add an about section</span>}
          </p>
        )}
      </Card>

      <Button variant="danger" size="lg" onClick={onLogout} className="w-full">
        <LogOut size={16} /> Log Out
      </Button>
    </div>
  );
}

function Stat({ icon, label, value }) {
  const Icon = icon;
  return (
    <Card className="flex flex-col items-center gap-1 p-4 text-center">
      <Icon size={18} className="text-brand" />
      <p className="text-lg font-extrabold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </Card>
  );
}
