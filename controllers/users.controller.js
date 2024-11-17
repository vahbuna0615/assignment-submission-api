const User = require('../models/users.model');
const Assignment = require('../models/assignments.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
require('dotenv').config();

const {  
  GOOGLE_OAUTH_URL: googleOauthUrl, 
  GOOGLE_CLIENT_ID: googleClientId, 
  GOOGLE_CLIENT_SECRET: googleClientSecret,
  GOOGLE_ACCESS_TOKEN_URL: googleAccessTokenUrl, 
  GOOGLE_CALLBACK_URL: googleCallbackUrl,
  GOOGLE_TOKEN_INFO_URL: googleTokenInfoUrl,
  GOOGLE_OAUTH_PASS: googleOauthPass, 
  STATE: state,
  BASE_URL: baseUrl
} = process.env

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
    const allAdmins = await User.find({ role: 'admin' }).select('-password');

    return res.status(200).json(allAdmins);
  } catch(err) {
    next(err)
  }
}

// OAuth Implementation

const oauthRedirect = (req, res, next) => {
  const googleOauthScopes = [
    "https%3A//www.googleapis.com/auth/userinfo.email",
    "https%3A//www.googleapis.com/auth/userinfo.profile",
  ]

  const scopes = googleOauthScopes.join(" ");

  const googleOauthConsentScreenUrl = `${googleOauthUrl}?client_id=${googleClientId}&redirect_uri=${googleCallbackUrl}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;

  try {
    res.redirect(googleOauthConsentScreenUrl)
  } catch (err) {
    next(err)
  }
}

const oauthCallback = async (req, res, next) => {

  const { code } = req.query;

  const data = {
    code,
    client_id: googleClientId,
    client_secret: googleClientSecret,
    redirect_uri: `${baseUrl}/google/callback`,
    grant_type: "authorization_code"
  }

  try {

    // exchange authorization code for access token & id_token
    const response = await fetch(googleAccessTokenUrl, {
      method: 'POST',
      body: JSON.stringify(data)
    })

    const access_token_data = await response.json()

    const { id_token } = access_token_data;

    // verify and extract the information in the id token
    const token_info_response = await fetch(
      `${googleTokenInfoUrl}?id_token=${id_token}`
    )

    const token_info_data = await token_info_response.json();

    // check if the user exists, if not then create new user

    const { email, name } = token_info_data;
    let user = await User.findOne({ email }).select("-pasword");
    if (!user) {
      user = await User.create({ email, name, password: googleOauthPass }) 
    }

    const token = generateToken(user.id);
    res.status(token_info_response.status).json({
      user,
      token
    })
  } catch (err) {
    next(err)
  }
}


module.exports = {
  registerUser,
  loginUser,
  uploadAssignment,
  getAllAdmins,
  oauthRedirect,
  oauthCallback
}