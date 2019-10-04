const mongoose = require('mongoose')
const emailValidator = require('validator')
const beautifyUnique = require('mongoose-beautiful-unique-validation');


const Schema = mongoose.Schema
const usersSchema = new Schema({
    email: {
        type: String,
        unique: 'Email in use',
        required: [true, 'Cannot be empty email field'],
        validate: {
            validator: (email) => emailValidator.isEmail(email),
            message: 'Email invalid'
        }
    },
    username: {
        type: String,
        unique: 'Username in use',
        required: [true, 'Cannot be empty username field'],
        minlength: [4, 'Username must be more than 4 characters'],
    },
    password: {
        type: String
    }
})

usersSchema.plugin(beautifyUnique);
const User = mongoose.model('User', usersSchema)

module.exports = User