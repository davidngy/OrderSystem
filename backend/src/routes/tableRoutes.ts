import { Router } from 'express';
import {
  createTables,
  getTable,
  getTables
} from '../controllers/tableController';
import { authorizeToken } from '../middlewares/authHandlers';

const router = Router();

router.post('/createTable', authorizeToken, createTables);
router.get('/tables', authorizeToken, getTables);
router.get('/tables/:id', authorizeToken, getTable)

export default router;