const { validationResult } = require('express-validator');
const Assignment = require('../models/assignments.model');

/**
 * @desc Retrieve assignments for the given admin user
 * @route GET /assignments
 * @access Private (admins only)
 */

const getAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ admin: req.user.id })

    return res.status(200).json(assignments)
  } catch (err) {
    next(err)
  }
}

/**
 * @desc Accept assignment submission
 * @route POST /assignments/:id/accept
 * @access Private (admins only)
 */

const acceptAssignment = async (req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).json({
      message: "Validation error",
      error: result.errors
    })
  }

  const { id } = req.params;

  try {

    const assignmentExists = await Assignment.findById(id)

    if (!assignmentExists) {
      res.status(404)
      throw new Error("Assignment with given id not found")
    }

    const assignment = await Assignment.findByIdAndUpdate(id, { status: 'accepted' }, { new: true })

    return res.status(200).json({
      message: "Assignment accepted",
      assignment
    })
  } catch (err) {
    next(err)
  }
}

/**
 * @desc Reject assignment submission
 * @route POST /assignments/:id/reject
 * @access Private (admins only)
 */

const rejectAssignment = async (req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).json({
      message: "Validation error",
      error: result.errors
    })
  }

  const { id } = req.params;

  try {

    const assignmentExists = await Assignment.findById(id)

    if (!assignmentExists) {
      res.status(404)
      throw new Error("Assignment with given id not found")
    }

    const assignment = await Assignment.findByIdAndUpdate(id, { status: 'rejected' }, { new: true })

    return res.status(200).json({
      message: "Assignment rejected",
      assignment
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAssignments,
  acceptAssignment,
  rejectAssignment
}