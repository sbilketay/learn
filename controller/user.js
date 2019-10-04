const Jwt = require('./jwt')
const bcrypt = require('bcrypt')
const UserModel = require('../models/users')
const validator = require('validator')

// LOGIN
const login = async (userdata) => {
  // Are the password the same?
  if (userdata.username == '' || userdata.password == '') {
    console.log('Fields cannot be empty!');
    return {
      status: 401,
      error: true,
      message: 'Fields cannot be empty!'
    }
  }
  try {
    let user = await UserModel.findOne({ email: userdata.email })
    // Password registered?
    if (!bcrypt.compareSync(userdata.password, user.password)) throw new Error('Password not registered!')
    let token = await Jwt.create({ userid: user._id })
    // Everythings is OK!
    return {
      status: 200,
      error: false,
      token,
      message: 'Login successful'
    }
  } catch (error) {
    // Password or email is wrong!
    console.log(error);
    return {
      status: 401,
      error: true,
      message: 'User not found'
    }
  }
}

// REGISTER
const register = async (userdata) => {
  try {
    if (userdata.password == '' || userdata.repassword == '') {
      throw new Error('Cannot be empty password field')
    }
    else if (userdata.password != undefined) {
      if (userdata.password.length < 6) {
        throw new Error('Password must be more than 6 characters')
      }
    }
    if (userdata.password != userdata.repassword) {
      throw new Error('Password don\'t match')
    }

    const newUser = new UserModel({
      email: userdata.email,
      password: bcrypt.hashSync(userdata.password, 10),
      username: userdata.username,
    })
    await newUser.save()
    // Everythings is OK!
    return {
      status: 200,
      error: false,
      message: 'Signup successful!'
    }
  } catch (error) {

    try {
      if (error.errors != undefined) {
        // Email in errors
        if (error.errors.email != undefined) {
          throw new Error(error.errors.email.message)
        }
        // Username in errors
        if (error.errors.username != undefined) {
          throw new Error(error.errors.username.message)
        }
      }
    } catch (error) {
      // Mongoose Validation Errors
      return {
        status: 401,
        error: true,
        message: error.message
      }
    }
    // Form Validation Errors
    return {
      status: 401,
      error: true,
      message: error.message
    }
  }
}

module.exports = { login, register }