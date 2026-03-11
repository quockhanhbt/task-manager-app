import axios from 'axios';

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  withCredentials: true,
});

export const fetchTasks = (status) =>
  api.get('/tasks', { params: status ? { status } : {} }).then((r) => r.data.data);

export const fetchTask = (id) =>
  api.get(`/tasks/${id}`).then((r) => r.data.data);

export const createTask = (payload) =>
  api.post('/tasks', payload).then((r) => r.data.data);

export const updateTask = (id, payload) =>
  api.put(`/tasks/${id}`, payload).then((r) => r.data.data);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`).then((r) => r.data.data);
