import { Router } from 'express';
import { getMenu } from '../controllers/menuController';
import { authorizeToken } from '../middlewares/authHandlers';

const router = Router();

router.get('/menu', authorizeToken, getMenu);

export default router;