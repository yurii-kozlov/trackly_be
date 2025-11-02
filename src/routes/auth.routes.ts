import { authController } from '#controllers/auth/auth.controllers.js';
import { verifyJWT } from '#middlewares/auth.middleware.js';
import { validate } from '#middlewares/validator.middleware.js';
import { userChangeCurrentPasswordValidator, userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgotPasswordValidator } from '#validators/auth.validators.js';
import { Router } from 'express';

const router = Router();

router.route('/register').post(userRegisterValidator(), validate, authController.registerUser);
router.route('/login').post(userLoginValidator(), validate, authController.loginUser);
router.route('/verify-email/:verificationToken').get(authController.verifyEmail);
router.route('/refresh-token').post(authController.refreshAccessToken);
router
  .route('/forgot-password')
  .post(userForgotPasswordValidator(), validate, authController.initiatePasswordReset);
router
  .route('/reset-password/:resetToken')
  .post(userResetForgotPasswordValidator(), validate, authController.resetForgotPassword);

router.route('/logout').post(verifyJWT, authController.logoutUser);
router.route('/current-user').get(verifyJWT, authController.getCurrentUser);
router
  .route('/change-password')
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    authController.changeCurrentPassword,
  );
router.route('/resend-email-verification').post(verifyJWT, authController.resendEmailVerification);

export default router;
