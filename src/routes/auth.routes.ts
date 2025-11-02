import { authController } from '#controllers/auth/auth.controllers.js';
import { verifyJWT } from '#middlewares/auth.middleware.js';
import { validate } from '#middlewares/validator.middleware.js';
import { userLoginValidator, userRegisterValidator } from '#validators/auth.validators.js';
import { Router } from 'express';

const router = Router();

router.route('/register').post(userRegisterValidator(), validate, authController.registerUser);
router.route('/login').post(userLoginValidator(), validate, authController.loginUser);
router.route('/logout').post(verifyJWT, authController.logoutUser);

export default router;
