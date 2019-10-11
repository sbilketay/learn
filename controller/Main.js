const Jwt = require('./jwt')
const Validation = require('./validation')
const bcrypt = require('bcrypt')
const UserModel = require('../models/users')

// LOGIN
const login = async (userdata) => {
  // Form validation
  const { error } = Validation.loginSchema.validate(userdata)
  if (error) return {
    status: 401,
    error: true,
    message: error.details[0].message
  }
  try {
    // Find user Mongodb and validation email
    let user = await UserModel.findOne({ email: userdata.email.toLowerCase() })
    // If have a user, the password validate in Mongodb
    if (!bcrypt.compareSync(userdata.password, user.password)) throw new Error() // User password not compare!
    // Everythings is OK!
    let token = await Jwt.create({ userid: user._id, remember: userdata.rememberMe })
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
      username: userdata.username.trim().toLowerCase(),
      email: userdata.email.trim().toLowerCase(),
      password: bcrypt.hashSync(userdata.password.trim(), 10),
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
    console.log(error.message);
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
      console.log(error.message);
      return {
        status: 401,
        error: true,
        message: error.message
      }
    }
    // Mongodb Save Error
    console.log(error.message);
    return {
      status: 401,
      error: true,
      message: 'Doesn\'t save'
    }
  }
}

module.exports = { login, register }