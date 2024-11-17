const Assignment = require('../models/assignments.model');

const getAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ admin: req.user.id })

    return res.status(200).json(assignments)
  } catch (err) {
    next(err)
  }
}

const updateAssignmentStatus = async (id, status) => {

  const assignment = await Assignment.findByIdAndUpdate(id, { status }, { new: true })
  return assignment
}

const acceptAssignment = async (req, res, next) => {
  const { id } = req.params;

  try {

    const assignmentExists = await Assignment.findById(id)

    if (!assignmentExists) {
      res.status(404)
      throw new Error("Assignment with given id not found")
    }

    await updateAssignmentStatus(id, 'accepted')

    return res.status(200).json({
      message: "Assignment accepted"
    })
  } catch (err) {
    next(err)
  }
}

const rejectAssignment = async (req, res, next) => {

  const { id } = req.params;

  try {

    const assignmentExists = await Assignment.findById(id)

    if (!assignmentExists) {
      res.status(404)
      throw new Error("Assignment with given id not found")
    }

    await updateAssignmentStatus(id, 'rejected')

    return res.status(200).json({
      message: "Assignment rejected"
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