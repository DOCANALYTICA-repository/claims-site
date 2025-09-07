import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Helper function to generate a JWT
const generateToken = (id) =>
{
  return jwt.sign({
    id
  }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
// @desc   Register a new user
// @route  POST /api/users/register
export const registerUser = async (req, res) =>
{
  try {
    const {
      name,
      email,
      regNo,
      empId,
      password,
      role,
      designation
    } = req.body;
    if (!name || !email || !password || !role || (!regNo && !empId)) {
      res.status(400);
      throw new Error('Please include all required fields');
    }
    const userExists = await User.findOne({
      $or: [{
        email
      }, {
        regNo
      }, {
        empId
      }]
    });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      regNo,
      empId,
      password: hashedPassword,
      role,
      designation,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.json({
      message: error.message
    });
  }
};
// @desc   Authenticate a user
// @route  POST /api/users/login
export const loginUser = async (req, res) =>
{
  try {
    const {
      email,
      password
    } = req.body;
    const user = await User.findOne({
      email
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.json({
      message: error.message
    });
  }
};
// @desc   Get user data
// @route  GET /api/users/me
export const getMe = async (req, res) =>
{
  res.status(200).json(req.user);
};