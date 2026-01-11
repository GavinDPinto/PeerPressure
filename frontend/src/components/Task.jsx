export default function Task({ title, pointValue, description, schedule, status, completedToday }) {
    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="text-gray-300"><strong>Points:</strong> {pointValue}</p>
            <p className="text-gray-300"><strong>Description:</strong> {description}</p>
            <p className="text-gray-300"><strong>Schedule:</strong> {schedule}</p>
            <p className="text-gray-300"><strong>Status:</strong> {status}</p>
            {completedToday && <p className="text-green-500">✓ Completed Today</p>}
        </div>
    );
}