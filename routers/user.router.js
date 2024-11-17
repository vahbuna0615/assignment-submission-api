const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../middlewares/auth.middleware');
const { loginUser, registerUser, getAllAdmins, uploadAssignment } = require('../controllers/users.controller');

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
 *        description: User with given email id already exists
 *      500:
 *        description: Other error
 */
router.post('/register', registerUser)

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
 *      404:
 *        description: User with given email id not found
 *      401:
 *        description: Invalid Credentials
 *      500:
 *        description: Other error
 */
router.post('/login', loginUser);

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
 *      401:
 *        description: Unauthorized access
 *      500:
 *        description: Other error
 */
router.post('/upload', isLoggedIn, uploadAssignment);

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

module.exports = router;