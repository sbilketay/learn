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
  let formValidMessage = []
  if (userdata.password == '' || userdata.repassword == '') {
    console.log('Cannot be empty password field');
    formValidMessage.push('Cannot be empty password field')
  } else if (userdata.password != undefined) {
    if (userdata.password.length < 6) {
      console.log('Password must be more than 6 characters');
      formValidMessage.push('Password must be more than 6 characters')
    }
  } 
  if(userdata.password != userdata.repassword) {
    console.log('Password don\'t match');
    formValidMessage.push('Password don\'t match')
  }
  
  if (formValidMessage != '') {
    return {
      status: 401,
      error: true,
      message: formValidMessage
    }
  }

  try {
    const newUser = new UserModel({
      email: userdata.email,
      password: bcrypt.hashSync(userdata.password, 10),
      username: userdata.username,
    })
    // Everythings is OK!
    await newUser.save()
    return {
      status: 200,
      error: false,
      message: 'Signup successful!'
    }
  } catch (error) {
    let mongoValidMessage = []
    // Email in use?
    if (error.errors != undefined) {
      if (error.errors.email != undefined) {
        console.log(error.errors.email.message);
        mongoValidMessage.push(error.errors.email.message)
      }
      if (error.errors.username != undefined) {
        console.log(error.errors.username.message);
        mongoValidMessage.push(error.errors.username.message)
      }
    }
    // MongoDB failed during saved!
    console.log('Doesn\'t save!');
    return {
      status: 401,
      error: true,
      message: mongoValidMessage != '' ? mongoValidMessage : 'Doesn\'t save!'
    }
  }
}

module.exports = { login, register }