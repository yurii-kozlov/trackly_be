import { authController } from '#controllers/auth.controllers.js';
import { validate } from '#middlewares/validator.middleware.js';
import { userRegisterValidator } from '#validators/userRegistration.validator.js';
import { Router } from 'express';

const router = Router();

router.route('/register').post(userRegisterValidator(), validate, authController.registerUser);

export default router;
