const express = require('express');
const { getAssignments, acceptAssignment, rejectAssignment } = require('../controllers/assignment.controller');
const { isAdmin, isLoggedIn } = require('../middlewares/auth.middleware');
const { param } = require('express-validator');
const router = express.Router()

router.use(isLoggedIn)

const idParamValidation = [
  param('id')
    .exists().isMongoId().withMessage('must be a valid id string')
]

/**
 * @swagger
 * tags:
 *  name: Assignments
 *  description: API for admin users to manage assignment submissions
 */


/**
 * @swagger
 *  paths:
 *   /assignments:
 *    get:
 *     components:
 *      securitySchemes:
 *        bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *     security:
 *      - bearerAuth: []
 *     tags: [Assignments]
 *     summary: Get all assignments for given admin
 *     description: Retrieves all assignments for the given admin
 *     responses:
 *      200:
 *        description: Successfully retrieves submissions assigned to given admin 
 *      401:
 *        description: Unauthorized access
 *      500:
 *        description: Other error
 */
router.get('/', isAdmin, getAssignments);

/**
 * @swagger
 *  paths:
 *   /assignments/{id}/accept:
 *    post:
 *     components:
 *      securitySchemes:
 *        bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *     security:
 *      - bearerAuth: []
 *     tags: [Assignments]
 *     summary: Accept assignment
 *     description: Accepts assignment submission using given id
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Id of the assignment
 *        schema:
 *          type: string
 *     responses:
 *      200:
 *        description: Successfully accepts submission
 *      400:
 *        description: Validation error
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Not Found error
 *      500:
 *        description: Other error
 */
router.post('/:id/accept', idParamValidation, acceptAssignment);

/**
 * @swagger
 *  paths:
 *   /assignments/{id}/reject:
 *    post:
 *     components:
 *      securitySchemes:
 *        bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *     security:
 *      - bearerAuth: []
 *     tags: [Assignments]
 *     summary: Reject assignment
 *     description: Rejects assignment submission using given id
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Id of the assignment
 *        schema:
 *          type: string
 *     responses:
 *      200:
 *        description: Successfully rejects submission
 *      400:
 *        description: Validation error
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Not Found error
 *      500:
 *        description: Other error
 */
router.post('/:id/reject', idParamValidation, rejectAssignment);

module.exports = router