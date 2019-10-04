const mongoose = require('mongoose')
const emailValidator = require('validator')

const Schema = mongoose.Schema
const usersSchema = new Schema({
    email: {
        type: String,
        unique: [true, 'Email in use'],
        required: [true, 'Cannot be empty email field'],
        validate: {
            validator: (email) => emailValidator.isEmail(email),
            message: 'Email invalid'
        }
    },
    username: {
        type: String,
        unique: [true, 'Username available'],
        required: [true, 'Cannot be empty username field'],
        minlength: [4, 'Username must be more than 4 characters'],
    },
    password: {
        type: String,
        required: [true, 'Cannot be empty password field'],
        minlength: [6, 'Password must be more than 6 characters'],
    }
})

const User = mongoose.model('User', usersSchema)

module.exports = User