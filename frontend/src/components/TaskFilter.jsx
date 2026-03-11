const STATUSES = [
  { value: '',            label: 'All' },
  { value: 'todo',        label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done',        label: 'Done' },
];

export default function TaskFilter({ filter, onChange }) {
  return (
    <div className="flex gap-2">
      {STATUSES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
            ${filter === value
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
