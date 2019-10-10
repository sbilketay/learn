const Jwt = require('./jwt')
const Validation = require('./validation')
const bcrypt = require('bcrypt')
const UserModel = require('../models/users')
const Joi = require('@hapi/joi')


// LOGIN
const login = async (userdata) => {
  // Form validation
  const { error } = Validation.loginSchema.validate(userdata)
  console.log(error);
  
  if (error) return {
    status: 401,
    error: true,
    message: error.details[0].message
  }
  try {
    // Mongodb validation email
    let user = await UserModel.findOne({ email: userdata.email })
    // Mongodb validation password
    if (!bcrypt.compareSync(userdata.password, user.password)) throw new Error() // User password not compare!
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
    return {
      status: 401,
      error: true,
      message: 'User not found'
    }
  }
}
// REGISTER
const register = async (userdata) => {
  // Form validation
  const { error } = Validation.registerSchema.validate(userdata)
  if (error) return {
    status: 401,
    error: true,
    message: error.details[0].message
  }
  try {
    const newUser = new UserModel({
      username: userdata.username,
      email: userdata.email,
      password: bcrypt.hashSync(userdata.password, 10),
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