import TaskCard from './TaskCard.jsx';

export default function TaskList({ tasks, loading, error, onEdit, onDelete }) {
  if (loading) return (
    <div className="flex justify-center py-16 text-gray-400 text-sm">Loading...</div>
  );

  if (error) return (
    <div className="text-center py-16 text-red-500 text-sm">{error}</div>
  );

  if (!tasks.length) return (
    <div className="text-center py-16 text-gray-400 text-sm">No tasks found.</div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
