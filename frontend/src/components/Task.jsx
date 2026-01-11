import { useState } from 'react';
export default function Task({ id, title, pointValue, description, schedule, status, completedToday, onComplete, onDelete }) {
    const [active, setActive] = useState(false)
    const handleComplete = (e) => {
        e.stopPropagation(); // Prevent parent div click
        if (onComplete) {
            onComplete(id);
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent parent div click
        if (onDelete) {
            onDelete(id);
        }
    };


    return (
        <div
      onClick={() => setActive(!active)}
      className={`flex flex-row gap-20 bg-gray-800 hover p-4  rounded-lg border-3 border-gray-800 ${active ? 'w-full cursor-pointer' : 'w-full h-30 cursor-pointer'} transition-all duration-300`}
    >       
            <div className='flex flex-col pb-6'>
            <h2 className="p-5 text-2xl font-semibold text-white">{title}</h2>
            {active && (
                <div className="flex  flex-col text-gray-300 text-left ml-10  mt-6  gap-1 text-xl w-full">
                    <p><strong>Points:</strong> {pointValue}</p>
                    <p><strong>Description:</strong> {description}</p>
                    <p><strong>Schedule:</strong> {schedule}</p>
                    <p><strong>Status:</strong> {status}</p>
                </div>
            )}
            </div>

            {active && <div className="flex flex-col gap-2 mt-30">
                {completedToday ? (
                    <p className="text-green-500">✓ Completed Today</p>
                ) : (
                    <button
                        onClick={handleComplete}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        Complete
                    </button>
                )}
                <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Delete
                </button>
            </div>}
            
            
        </div>
    );
}