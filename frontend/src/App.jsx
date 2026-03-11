import { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { useTasks } from './hooks/useTasks.js';
import TaskList from './components/TaskList.jsx';
import TaskFilter from './components/TaskFilter.jsx';
import TaskForm from './components/TaskForm.jsx';
import Modal from './components/Modal.jsx';
import LoginPage from './pages/LoginPage.jsx';

export default function App() {
  const { user, logout } = useAuth();
  const { tasks, filter, setFilter, loading, error, addTask, editTask, removeTask } = useTasks();
  const [modal, setModal] = useState(null);

  // Loading auth state
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!user) return <LoginPage />;

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

  const handleStatusChange = async (id, status) => {
    await editTask(id, { status });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Task Manager</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreate}
            className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + New Task
          </button>

          {/* User menu */}
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
              : <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                  {user.name?.[0]?.toUpperCase() ?? '?'}
                </div>
            }
            <span className="text-sm text-gray-700 hidden sm:block">{user.name}</span>
            <button
              onClick={logout}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            {filter ? ` · filtered by "${filter}"` : ''}
          </p>
        </div>

        <div className="mb-6">
          <TaskFilter filter={filter} onChange={setFilter} />
        </div>

        <TaskList
          tasks={tasks}
          filter={filter}
          loading={loading}
          error={error}
          onEdit={openEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </main>

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
