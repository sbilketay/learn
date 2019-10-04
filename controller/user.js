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
    // Password registered
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
    const newUser = new UserModel({
      email: userdata.email,
      password: userdata.password != undefined && userdata.password && userdata.password.length >= 6 ? bcrypt.hashSync(userdata.password, 10) : null,
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
    // Mongodb error handling
    try {
      if (error.errors != undefined) {
        // Email in errors
        if (error.errors.email != undefined)
          throw new Error(error.errors.email.message)
        // Username in errors
        if (error.errors.username != undefined)
          throw new Error(error.errors.username.message)
        // Password in errors
        if (error.errors.password != undefined)
          throw new Error(error.errors.password.message)
      }
    } catch (error) {
      // Validation Errors
      return {
        status: 401,
        error: true,
        message: error.message
      }
    }
    // Mongodb Save Error
    return {
      status: 401,
      error: true,
      message: 'Doesn\'t save'
    }
  }
}

module.exports = { login, register }