import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/tasksController.js';

const router = Router();

router.get('/',     getAllTasks);
router.get('/:id',  getTaskById);
router.post('/',    createTask);
router.put('/:id',  updateTask);
router.delete('/:id', deleteTask);

export default router;
