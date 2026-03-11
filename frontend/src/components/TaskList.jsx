import { useState, useRef } from 'react';
import TaskCard from './TaskCard.jsx';

const COLUMNS = [
  { status: 'todo',        label: 'To Do',      headerClass: 'bg-gray-100 text-gray-600' },
  { status: 'in-progress', label: 'In Progress', headerClass: 'bg-yellow-100 text-yellow-700' },
  { status: 'done',        label: 'Done',        headerClass: 'bg-green-100 text-green-700' },
];

export default function TaskList({ tasks, loading, error, onEdit, onDelete, onStatusChange, filter }) {
  const [dragOverStatus, setDragOverStatus] = useState(null);
  const dragTaskId = useRef(null);

  if (loading) return (
    <div className="flex justify-center py-16 text-gray-400 text-sm">Loading...</div>
  );

  if (error) return (
    <div className="text-center py-16 text-red-500 text-sm">{error}</div>
  );

  // Filtered: flat grid, no drag-and-drop needed
  if (filter) {
    if (!tasks.length) return (
      <div className="text-center py-16 text-gray-400 text-sm">No tasks found.</div>
    );
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
        ))}
      </div>
    );
  }

  const handleDragStart = (taskId) => {
    dragTaskId.current = taskId;
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    setDragOverStatus(status);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    setDragOverStatus(null);
    if (dragTaskId.current == null) return;
    const task = tasks.find((t) => t.id === dragTaskId.current);
    if (task && task.status !== status) {
      onStatusChange(dragTaskId.current, status);
    }
    dragTaskId.current = null;
  };

  const handleDragLeave = (e) => {
    // Only clear when leaving the column entirely (not a child element)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverStatus(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {COLUMNS.map(({ status, label, headerClass }) => {
        const col = tasks.filter((t) => t.status === status);
        const isOver = dragOverStatus === status;

        return (
          <div
            key={status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDrop={(e) => handleDrop(e, status)}
            onDragLeave={handleDragLeave}
            className={`flex flex-col gap-3 rounded-xl p-2 transition-colors ${
              isOver ? 'bg-indigo-50 ring-2 ring-indigo-300 ring-dashed' : ''
            }`}
          >
            {/* Column header */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${headerClass}`}>
              <span className="text-sm font-semibold">{label}</span>
              <span className="text-xs font-medium bg-white/60 px-2 py-0.5 rounded-full">
                {col.length}
              </span>
            </div>

            {/* Cards */}
            {col.length === 0
              ? (
                <div className={`text-center text-xs py-8 rounded-lg border-2 border-dashed transition-colors ${
                  isOver ? 'border-indigo-300 text-indigo-400' : 'border-gray-200 text-gray-300'
                }`}>
                  Drop here
                </div>
              )
              : col.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  onDragStart={handleDragStart}
                />
              ))
            }
          </div>
        );
      })}
    </div>
  );
}
