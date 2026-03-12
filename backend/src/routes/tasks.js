import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskHistory,
} from '../controllers/tasksController.js';

const router = Router();

router.use(requireAuth);

router.get('/',            getAllTasks);
router.get('/:id',         getTaskById);
router.get('/:id/history', getTaskHistory);
router.post('/',           createTask);
router.put('/:id',         updateTask);
router.delete('/:id',      deleteTask);

export default router;
