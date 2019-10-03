const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema
const usersSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Cannot be blank'],
        match: [/\S+@\S+\.\S+/, 'Email not available!']

    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Cannot be blank'] 
    },
    password: String
})


usersSchema.plugin(uniqueValidator);
const User = mongoose.model('User', usersSchema)

module.exports = User