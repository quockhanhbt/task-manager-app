const STATUS_STYLES = {
  'todo':        'bg-gray-100 text-gray-600',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  'done':        'bg-green-100 text-green-700',
};

const STATUS_LABELS = {
  'todo':        'To Do',
  'in-progress': 'In Progress',
  'done':        'Done',
};

const STATUSES = ['todo', 'in-progress', 'done'];

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr.slice(0, 10) + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dateStr, status) {
  if (!dateStr || status === 'done') return false;
  return new Date(dateStr.slice(0, 10) + 'T00:00:00') < new Date(new Date().toDateString());
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, onDragStart }) {
  const overdue = isOverdue(task.due_date, task.status);

  return (
    <div
      draggable
      onDragStart={() => onDragStart?.(task.id)}
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing active:opacity-50 active:scale-95"
    >
      <h3 className="font-semibold text-gray-800 text-sm leading-snug">{task.title}</h3>

      {task.description && (
        <p className="mt-1.5 text-gray-500 text-xs leading-relaxed line-clamp-2">{task.description}</p>
      )}

      {task.due_date && (
        <p className={`mt-2 text-xs font-medium ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
          {overdue ? 'Overdue · ' : 'Due · '}{formatDate(task.due_date)}
        </p>
      )}

      {task.assignee && (
        <p className="mt-1 text-xs text-gray-400">
          <span className="font-medium text-gray-500">Assignee:</span> {task.assignee}
        </p>
      )}

      {/* Status selector */}
      <div className="mt-3">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300 ${STATUS_STYLES[task.status]}`}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onEdit(task)}
          className="text-xs px-3 py-1 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
