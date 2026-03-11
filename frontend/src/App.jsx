import { useState } from 'react';
import { useTasks } from './hooks/useTasks.js';
import TaskList from './components/TaskList.jsx';
import TaskFilter from './components/TaskFilter.jsx';
import TaskForm from './components/TaskForm.jsx';
import Modal from './components/Modal.jsx';

export default function App() {
  const { tasks, filter, setFilter, loading, error, addTask, editTask, removeTask } = useTasks();
  const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', task }

  const openCreate = () => setModal({ mode: 'create' });
  const openEdit   = (task) => setModal({ mode: 'edit', task });
  const closeModal = () => setModal(null);

  const handleSubmit = async (payload) => {
    if (modal.mode === 'create') {
      await addTask(payload);
    } else {
      await editTask(modal.task.id, payload);
    }
    closeModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await removeTask(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Task Manager</h1>
        <button
          onClick={openCreate}
          className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + New Task
        </button>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Summary */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            {filter ? ` · filtered by "${filter}"` : ''}
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <TaskFilter filter={filter} onChange={setFilter} />
        </div>

        {/* Task Grid */}
        <TaskList
          tasks={tasks}
          filter={filter}
          loading={loading}
          error={error}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Modal */}
      {modal && (
        <Modal
          title={modal.mode === 'create' ? 'New Task' : 'Edit Task'}
          onClose={closeModal}
        >
          <TaskForm
            initial={modal.mode === 'edit' ? modal.task : {}}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
