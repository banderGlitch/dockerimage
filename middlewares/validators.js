import { body } from "express-validator";

export const registerValidator = [
    body('email')
        .isEmail()
        .withMessage('A valid message is required'),

    body('username')
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

];


export const loginValidator = [
    body('email').isEmail().withMessage('A valid email is required'),

    body('password').notEmpty().withMessage('Password is required')
]