const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../middlewares/auth.middleware');
const { loginUser, registerUser, getAllAdmins, uploadAssignment, oauthRedirect, oauthCallback } = require('../controllers/users.controller');
const { body } = require('express-validator');

const loginUserValidation = [
  body('email')
    .exists().withMessage('email field is required')
    .isEmail().withMessage('must be a valid email address'),
  
  body('password')
    .exists().withMessage('password is a required field')
    .isString().withMessage('password must be a valid string value')
    .isLength({ min: 6 }).withMessage('password must be atleast 6 characters long')

]

const registerUserValidation = [
  ...loginUserValidation,
  body('name')
    .exists().withMessage('name field is required')
    .isString().notEmpty().withMessage('name should be a non-empty string value'),

  body('role')
    .if(body('role').exists())
    .isIn(['admin', 'user']).withMessage('role can be either of the two values - admin | user')
  
]

const uploadAssignmentValidation = [
  body('task')
    .exists().withMessage('task field is required')
    .isString().notEmpty().withMessage('task must be a valid non-empty string value'),

  body('admin')
    .exists().withMessage('admin field is required')
    .isMongoId().withMessage('admin must be a valid id string')
  
]


/**
 * @swagger
 * tags:
 *  name: Users
 *  description: API for user management
 */

/**
 * @swagger
 *  paths:
 *   /register:
 *    post:
 *     components:
 *      securitySchemes:
 *        bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *     security:
 *      - bearerAuth: []
 *     tags: [Users]
 *     summary: Register new user
 *     description: Registers a new user
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          name:
 *           type: string
 *           description: Name of the user
 *           example: User name
 *          email: 
 *           type: string
 *           description: Email id of the user
 *           example: user1@email.com
 *          password: 
 *           type: string
 *           description: Password of the user
 *           example: string
 *          role:
 *           type: string
 *           description: Role of the user
 *           example: user
 *     responses:
 *      201:
 *        description: Successfully registers new user
 *      400:
 *        description: Validation error/User with given email id already exists
 *      500:
 *        description: Other error
 */
router.post('/register', registerUserValidation, registerUser)

/**
 * @swagger
 *  paths:
 *   /login:
 *    post:
 *     components:
 *      securitySchemes:
 *        bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *     security:
 *      - bearerAuth: []
 *     tags: [Users]
 *     summary: Authenticates user
 *     description: Login for existing users
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          email: 
 *           type: string
 *           description: Email id of the user
 *           example: user1@email.com
 *          password: 
 *           type: string
 *           description: Password of the user
 *           example: string
 *     responses:
 *      201:
 *        description: Successfully logged in user
 *      400:
 *        description: Validation error
 *      401:
 *        description: Invalid Credentials
 *      404:
 *        description: User with given email id not found
 *      500:
 *        description: Other error
 */
router.post('/login', loginUserValidation, loginUser);

/**
 * @swagger
 *  paths:
 *   /upload:
 *    post:
 *     components:
 *      securitySchemes:
 *        bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *     security:
 *      - bearerAuth: []
 *     tags: [Users]
 *     summary: Assignment upload
 *     description: For uploading assignment submissions
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          task: 
 *           type: string
 *           description: Task submission details
 *           example: Sample task
 *          admin: 
 *           type: string
 *           description: id of the required admin
 *           example: id-string
 *     responses:
 *      201:
 *        description: Successfully created new assignment submission
 *      400:
 *        description: Validation error
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Admin with given id not found
 *      500:
 *        description: Other error
 */
router.post('/upload', isLoggedIn, uploadAssignmentValidation, uploadAssignment);

/**
 * @swagger
 *  paths:
 *   /admins:
 *    get:
 *     components:
 *      securitySchemes:
 *        bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *     security:
 *      - bearerAuth: []
 *     tags: [Users]
 *     summary: Get all admin users
 *     description: Retrieves all admin users
 *     responses:
 *      200:
 *        description: Successfully retrieves a list of available admin users
 *      401:
 *        description: Unauthorized access
 *      500:
 *        description: Other error
 */
router.get('/admins', isLoggedIn, getAllAdmins);

// redirects to oauth consent screen
router.get('/', oauthRedirect);

// handles oauth callback
router.get('/google/callback', oauthCallback);

module.exports = router;