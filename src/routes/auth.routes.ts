import { authController } from '#controllers/auth.controllers.js';
import { Router } from 'express';

const router = Router();

router.route('/register').post(authController.registerUser);

export default router;
