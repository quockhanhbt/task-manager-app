import { useEffect, useState } from 'react';
import { fetchTaskHistory } from '../api/tasks.js';

const FIELD_LABELS = {
  title:       'Title',
  description: 'Description',
  status:      'Status',
  due_date:    'Due Date',
  assignee:    'Assignee',
};

const STATUS_LABELS = {
  'todo':        'To Do',
  'in-progress': 'In Progress',
  'done':        'Done',
};

function formatValue(field, value) {
  if (value === null || value === undefined || value === '') return <em className="text-gray-300">empty</em>;
  if (field === 'status') return STATUS_LABELS[value] ?? value;
  if (field === 'due_date') {
    const d = new Date(value.slice(0, 10) + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return value;
}

function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function TaskHistory({ taskId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    fetchTaskHistory(taskId)
      .then(setHistory)
      .catch(() => setError('Failed to load history.'))
      .finally(() => setLoading(false));
  }, [taskId]);

  if (loading) return <p className="text-sm text-gray-400 py-4 text-center">Loading...</p>;
  if (error)   return <p className="text-sm text-red-500 py-4 text-center">{error}</p>;
  if (!history.length) return (
    <p className="text-sm text-gray-400 py-4 text-center">No changes recorded yet.</p>
  );

  return (
    <ol className="relative border-l border-gray-200 ml-2 space-y-5 max-h-96 overflow-y-auto pr-2">
      {history.map((entry) => (
        <li key={entry.id} className="ml-4">
          <div className="absolute -left-1.5 mt-1 w-3 h-3 rounded-full bg-indigo-400 border-2 border-white" />
          <p className="text-xs text-gray-400 mb-0.5" title={new Date(entry.changed_at).toLocaleString()}>
            {timeAgo(entry.changed_at)}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{FIELD_LABELS[entry.field] ?? entry.field}</span>
            {' changed'}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded line-through">
              {formatValue(entry.field, entry.old_value)}
            </span>
            <span className="text-gray-400">→</span>
            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">
              {formatValue(entry.field, entry.new_value)}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
