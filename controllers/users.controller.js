const User = require('../models/users.model');
const Assignment = require('../models/assignments.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

/**
 * @desc Register new user
 * @route POST /register
 * @access Public
 */

const registerUser = async(req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).json({
      message: "Validation error",
      error: result.errors
    })
  }

  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email })

    if (userExists) {
      res.status(400)
      throw new Error('User already exists')
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    })

    return res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    })

  } catch (err) {
    next(err)
  }
}

/**
 * @desc Authenticate a user
 * @route POST /login
 * @access Public
 */

const loginUser = async (req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).json({
      message: "Validation error",
      error: result.errors
    })
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })

    if (!user) {
      res.status(404)
      throw new Error("No user with given email id found")
    }

    const matchPassword = await bcrypt.compare(password, user.password)

    if (!matchPassword) {
      res.status(401)
      throw new Error("Invalid credentials")
    }

    return res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    })

  } catch (err) {
    next(err)
  }
}

/**
 * @desc Upload assignments
 * @route POST /upload
 * @access Private (logged in users)
 */

const uploadAssignment = async (req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).json({
      message: "Validation error",
      error: result.errors
    })
  }

  const { task, admin } = req.body

  try {

    const adminExists = await User.findOne({ id: admin, role: 'admin'})

    if (!adminExists) {
      res.status(404)
      throw new Error ('Admin with given id not found')
    }

    const assignment = await Assignment.create({
      user: req.user.id,
      task,
      admin
    })

    return res.status(201).json(assignment);

  } catch (err) {
    next(err)
  }
}

const getAllAdmins = async (req, res, next) => {
  try {
    const allAdmins = await User.find({
      role: 'admin'
    })

    return res.status(200).json(allAdmins);
  } catch(err) {
    next(err)
  }
}


module.exports = {
  registerUser,
  loginUser,
  uploadAssignment,
  getAllAdmins
}