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
  if (value === null || value === undefined || value === '') return '—';
  if (field === 'status') return STATUS_LABELS[value] ?? value;
  if (field === 'due_date') {
    const d = new Date(value.slice(0, 10) + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return value;
}

function formatTime(isoStr) {
  return new Date(isoStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
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

  if (loading) return <p className="text-sm text-gray-400 py-6 text-center">Loading...</p>;
  if (error)   return <p className="text-sm text-red-500 py-6 text-center">{error}</p>;
  if (!history.length) return (
    <p className="text-sm text-gray-400 py-6 text-center">No changes recorded yet.</p>
  );

  return (
    <div className="overflow-y-auto max-h-[28rem]">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wide">
            <th className="text-left font-medium py-2 pr-4 whitespace-nowrap">Time</th>
            <th className="text-left font-medium py-2 pr-4 whitespace-nowrap">Field</th>
            <th className="text-left font-medium py-2 pr-4">Before</th>
            <th className="text-left font-medium py-2 pr-2 w-4"></th>
            <th className="text-left font-medium py-2">After</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => (
            <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="py-2 pr-4 text-gray-400 whitespace-nowrap">
                {formatTime(entry.changed_at)}
              </td>
              <td className="py-2 pr-4 font-medium text-gray-600 whitespace-nowrap">
                {FIELD_LABELS[entry.field] ?? entry.field}
              </td>
              <td className="py-2 pr-2 max-w-[10rem] break-words">
                <span className="bg-red-50 text-red-500 px-1.5 py-0.5 rounded line-through">
                  {formatValue(entry.field, entry.old_value)}
                </span>
              </td>
              <td className="py-2 pr-2 text-gray-300 select-none">→</td>
              <td className="py-2 max-w-[10rem] break-words">
                <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                  {formatValue(entry.field, entry.new_value)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
