import { body, query } from "express-validator";


// Would you like to switch to Zod instead
// For more functionality like this 

export const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

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
        .matches(strongPasswordRegex).withMessage(
            'Password must be at least 8 characters long and includes upppercase, lowercase, number, and special character'
        )

];



export const searchUserValidator = [
    query('search')
      .optional()
      .isString().withMessage('Search must be a string'),
  ]


export const loginValidator = [
    body('email').isEmail().withMessage('A valid email is required'),

    body('password').notEmpty().withMessage('Password is required')
]