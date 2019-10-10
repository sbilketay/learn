const mongoose = require('mongoose')
const emailValidator = require('validator')
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const Schema = mongoose.Schema
const usersSchema = new Schema({
    email: {
        type: String,
        unique: 'Email in use',
        required: [true, 'Email cannot be an empty field'],
        validate: {
            validator: (email) => emailValidator.isEmail(email),
            message: 'Email must be a valid email'
        }
    },
    username: {
        type: String,
        unique: 'Username in use',
        required: [true, 'Username cannot be an empty field'],
        minlength: [4, 'Username should have a minimum length of 4'],
    },
    password: {
        type: String,
        required: [true, 'Password cannot be an empty field'],
    }
})

usersSchema.plugin(beautifyUnique);
const User = mongoose.model('User', usersSchema)

module.exports = User