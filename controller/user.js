const Jwt = require('./jwt')
const bcrypt = require('bcrypt')
const UserModel = require('../models/users')

// Login
const login = async (userdata) => {
  try {
    let user = await UserModel.findOne({ email: userdata.email })
    if (!bcrypt.compareSync(userdata.password, user.password)) {
      return {
        status: 401,
        error: true,
        message: 'User nots found'
      }
    }

    let token = await Jwt.create({ userid: user._id })
    return {
      status: 200,
      error: false,
      token,
      message: 'Login successful'
    }
  } catch (error) {
    return {
      status: 401,
      error: true,
      message: 'User not found'
    }
  }
}

// Register
const register = async (userdata) => {

  if (userdata.password != userdata.repassword) {
    return {
      status: 500,
      error: true,
      message: 'Password don\'t match'
    }
  }

  const newUser = new UserModel({
    email: userdata.email,
    password: bcrypt.hashSync(userdata.password, 10),
    username: userdata.username,
  })

  try {
    await newUser.save()
    return {
      status: 200,
      error: false,
      message: 'Signup successful!'
    }
  } catch (error) {
    if (error.code == '11000' || error.code == 'E11000') {
      return {
        status: 500,
        error: true,
        message: 'Email in use'
      }
    }
    return {
      status: 500,
      error: true,
      message: 'Doesn\'t save!'
    }
  }
}
module.exports = { login, register }