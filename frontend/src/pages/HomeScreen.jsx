import { useState, useEffect } from 'react';
import ActiveTasks from "../components/ActiveTasks.jsx";
import TokenDisplay from "../components/TokenDisplay.jsx";

export default function HomeScreen() {
  const [tokens, setTokens] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: 10,
    type: 'daily',
    target_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch tokens on mount
  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await fetch('/api/score');
      const data = await response.json();
      setTokens(data.total_points);
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        points: formData.points,
        type: formData.type,
        target_date: formData.target_date || undefined,
      };

      const response = await fetch('/api/resolutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('✓ Task created successfully!');
        setFormData({
          title: '',
          description: '',
          points: 10,
          type: 'daily',
          target_date: '',
        });
        setShowForm(false);
        // Trigger a refresh of ActiveTasks
        window.location.reload();
      } else {
        setMessage('✗ Failed to create task');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('✗ Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-row gap-10">
        <TokenDisplay tokens={tokens}/>
        <ActiveTasks onTaskComplete={fetchTokens}/>
      </div>

      <div className="mt-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded"
        >
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-4 bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md">
            <div className="mb-4">
              <label className="block text-white font-semibold mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white font-semibold mb-2">Points</label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white font-semibold mb-2">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              >
                <option value="daily">Daily</option>
                <option value="onetime">One-Time</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-white font-semibold mb-2">Target Date (for one-time tasks)</label>
              <input
                type="date"
                name="target_date"
                value={formData.target_date}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>

            {message && (
              <p className={`mt-3 text-center ${message.includes('✓') ? 'text-green-500' : 'text-red-500'}`}>
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}