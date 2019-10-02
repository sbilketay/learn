const mongoose = require('mongoose')
const Schema = mongoose.Schema
const usersSchema = new Schema({
    email: {
        unique: true,
        type: String
    },
    password: String,
    username: String
})


const User = mongoose.model('User', usersSchema)

module.exports = User