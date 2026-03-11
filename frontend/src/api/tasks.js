import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

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
