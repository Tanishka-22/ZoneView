import express from 'express';
import { getFilterOptions } from '../controllers/filtersController';

const router = express.Router();

router.get('/', getFilterOptions);

export default router;