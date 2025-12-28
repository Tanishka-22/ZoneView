import express from 'express';
import { getFilterOptions } from '../controllers/filtersController.js';

const router = express.Router();

router.get('/', getFilterOptions);

export default router;

