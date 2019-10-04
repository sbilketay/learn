const Jwt = require('./jwt')
const bcrypt = require('bcrypt')
const UserModel = require('../models/users')
const validator = require('validator')
const formValidator = require('./validator')

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
  formValidator.form(userdata)
  .then((data) => {
   console.log(data);
   
  })
  .catch((err) => {
    console.log(err);
  })

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
      console.log(error.errors.email);
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