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
  // Are password is compatible?
  if (userdata.password == '' || userdata.repassword == '' || userdata.username == '' || userdata.email == '') {
    console.log('Cannot be empty field!');
    return {
      status: 500,
      error: true,
      message: 'Cannot be empty field!'
    }
  }
  // Are password is compatible?
  if (userdata.password != userdata.repassword) {
    console.log('Password don\'t match');
    return {
      status: 500,
      error: true,
      message: 'Passwords don\'t match'
    }
  }
  // Email validation
  if (validator.isEmail(userdata.email) == false) {
    console.log('Email not available!');
    return {
      status: 500,
      error: true,
      message: 'Email not available!'
    }
  }

  const newUser = new UserModel({
    email: userdata.email,
    password: bcrypt.hashSync(userdata.password, 10),
    username: userdata.username,
  })

  try {
    // Everythings is OK!
    await newUser.save()
    return {
      status: 200,
      error: false,
      message: 'Signup successful!'
    }
  } catch (error) {
    // Email in use?
    if (error.errors.email != undefined) {      
      console.log('Email in use!');
      return {
        status: 500,
        error: true,
        message: 'Email in use!'
      }
    }
    // Username in use?
    if (error.errors.username != undefined) {
      console.log('Username in use!');
      return {
        status: 500,
        error: true,
        message: 'Username in use!'
      }
    }
    // MongoDB failed during saved!
    console.log('Doesn\'t save!');
    return {
      status: 500,
      error: true,
      message: 'Doesn\'t save!'
    }
  }
}

module.exports = { login, register }