import { body, type ValidationChain } from 'express-validator';

const userRegisterValidator = (): ValidationChain[] => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is invalid'),
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLowercase()
      .withMessage('Username must be in lowercase')
      .isLength({ min: 3 })
      .withMessage('Username must have at least 3 characters'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ];
};

const userLoginValidator = (): ValidationChain[] => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is invalid'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ];
};

export { userLoginValidator, userRegisterValidator };
