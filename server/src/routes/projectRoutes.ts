import express from 'express';
import {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
} from '../controllers/projectControllers';

const router = express.Router();

router.get('/', getAllProjects);
router.post('/', createProject); 
router.get('/:id', getProjectById);
router.put('/:id', updateProject);

export default router;
