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

  if (userdata.password != userdata.repassword) {
    console.log('Password don\'t match');
    return {
      status: 401,
      error: false,
      message: 'Password don\'t match'
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
    let errorMessage = []
    // Email in use?
    if (error.errors.email != undefined) {
      console.log(error.errors.email.message);
      errorMessage.push(error.errors.email.message)
    }
    if (error.errors.username != undefined) {
      console.log(error.errors.username.message);
      errorMessage.push(error.errors.username.message)
    }
    if (error.errors.password != undefined) {
      console.log(error.errors.password.message);
      errorMessage.push(error.errors.password.message)
    }
    // MongoDB failed during saved!
    console.log('Doesn\'t save!');
    return {
      status: 401,
      error: true,
      message: errorMessage
    }
  }
}

module.exports = { login, register }