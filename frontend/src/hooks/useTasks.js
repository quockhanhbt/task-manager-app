import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/tasks.js';

export function useTasks() {
  const [tasks, setTasks]       = useState([]);
  const [filter, setFilter]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchTasks(filter);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.error ?? 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const addTask = async (payload) => {
    const task = await api.createTask(payload);
    setTasks((prev) => [task, ...prev]);
    return task;
  };

  const editTask = async (id, payload) => {
    const task = await api.updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    return task;
  };

  const removeTask = async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, filter, setFilter, loading, error, addTask, editTask, removeTask, reload: load };
}
