import { useState, useRef, useEffect } from 'react';
import TaskCard from './TaskCard.jsx';

const COLUMNS = [
  { status: 'todo',        label: 'To Do',      headerClass: 'bg-gray-100 text-gray-600' },
  { status: 'in-progress', label: 'In Progress', headerClass: 'bg-yellow-100 text-yellow-700' },
  { status: 'done',        label: 'Done',        headerClass: 'bg-green-100 text-green-700' },
];

export default function TaskList({ tasks, loading, error, onEdit, onDelete, onStatusChange, onHistory, filter }) {
  const [dragOverStatus, setDragOverStatus] = useState(null);
  const dragTaskId = useRef(null);
  const touchState = useRef(null);

  // Refs so event listeners always see latest values without re-registering
  const tasksRef = useRef(tasks);
  useEffect(() => { tasksRef.current = tasks; }, [tasks]);
  const onStatusChangeRef = useRef(onStatusChange);
  useEffect(() => { onStatusChangeRef.current = onStatusChange; }, [onStatusChange]);

  // Non-passive touchmove so we can call preventDefault to block scrolling during drag
  useEffect(() => {
    const onTouchMove = (e) => {
      if (!touchState.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const { ghost, offsetX, offsetY } = touchState.current;

      ghost.style.left = `${touch.clientX - offsetX}px`;
      ghost.style.top  = `${touch.clientY - offsetY}px`;

      // Briefly hide ghost so elementFromPoint sees the element underneath
      ghost.style.visibility = 'hidden';
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      ghost.style.visibility = 'visible';

      const col = el?.closest('[data-status]');
      setDragOverStatus(col?.dataset.status ?? null);
    };

    const onTouchEnd = (e) => {
      if (!touchState.current) return;
      const touch = e.changedTouches[0];
      const { taskId, ghost } = touchState.current;

      ghost.remove();

      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const col = el?.closest('[data-status]');

      if (col) {
        const newStatus = col.dataset.status;
        const task = tasksRef.current.find((t) => t.id === taskId);
        if (task && task.status !== newStatus) {
          onStatusChangeRef.current(taskId, newStatus);
        }
      }

      setDragOverStatus(null);
      touchState.current = null;
    };

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
    return () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const handleTouchStart = (e, taskId) => {
    const touch = e.touches[0];
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const ghost = card.cloneNode(true);
    ghost.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      opacity: 0.85;
      pointer-events: none;
      z-index: 9999;
      transform: scale(1.04) rotate(1.5deg);
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      border-radius: 12px;
    `;
    document.body.appendChild(ghost);

    touchState.current = {
      taskId,
      ghost,
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    };
  };

  if (loading) return (
    <div className="flex justify-center py-16 text-gray-400 text-sm">Loading...</div>
  );

  if (error) return (
    <div className="text-center py-16 text-red-500 text-sm">{error}</div>
  );

  // Filtered view — flat grid, no drag needed
  if (filter) {
    if (!tasks.length) return (
      <div className="text-center py-16 text-gray-400 text-sm">No tasks found.</div>
    );
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} onHistory={onHistory} />
        ))}
      </div>
    );
  }

  // --- Desktop drag handlers ---
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
            data-status={status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDrop={(e) => handleDrop(e, status)}
            onDragLeave={handleDragLeave}
            className={`flex flex-col gap-3 rounded-xl p-2 transition-colors ${
              isOver ? 'bg-indigo-50 ring-2 ring-indigo-300 ring-dashed' : ''
            }`}
          >
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${headerClass}`}>
              <span className="text-sm font-semibold">{label}</span>
              <span className="text-xs font-medium bg-white/60 px-2 py-0.5 rounded-full">
                {col.length}
              </span>
            </div>

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
                  onHistory={onHistory}
                  onDragStart={handleDragStart}
                  onTouchStart={handleTouchStart}
                />
              ))
            }
          </div>
        );
      })}
    </div>
  );
}
