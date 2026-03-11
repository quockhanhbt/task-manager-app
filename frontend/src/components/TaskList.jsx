import TaskCard from './TaskCard.jsx';

const COLUMNS = [
  { status: 'todo',        label: 'To Do',       headerClass: 'bg-gray-100 text-gray-600' },
  { status: 'in-progress', label: 'In Progress',  headerClass: 'bg-yellow-100 text-yellow-700' },
  { status: 'done',        label: 'Done',         headerClass: 'bg-green-100 text-green-700' },
];

export default function TaskList({ tasks, loading, error, onEdit, onDelete, filter }) {
  if (loading) return (
    <div className="flex justify-center py-16 text-gray-400 text-sm">Loading...</div>
  );

  if (error) return (
    <div className="text-center py-16 text-red-500 text-sm">{error}</div>
  );

  // When filtered to a single status, show a flat list
  if (filter) {
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

  // Default: Kanban columns
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {COLUMNS.map(({ status, label, headerClass }) => {
        const col = tasks.filter((t) => t.status === status);
        return (
          <div key={status} className="flex flex-col gap-3">
            {/* Column header */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${headerClass}`}>
              <span className="text-sm font-semibold">{label}</span>
              <span className="text-xs font-medium bg-white/60 px-2 py-0.5 rounded-full">
                {col.length}
              </span>
            </div>

            {/* Cards */}
            {col.length === 0
              ? <p className="text-center text-gray-300 text-xs py-6">No tasks</p>
              : col.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
                ))
            }
          </div>
        );
      })}
    </div>
  );
}
