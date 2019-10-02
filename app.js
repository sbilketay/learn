const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const User = require('./controller/user')
const mongoose = require('mongoose')
const configs = require('./configs')

app.use('/users', require('./route/users'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// connect mongoose
app.use(async (req, res, next) => {
    try {
        await mongoose.connect(configs.mongodburl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
            .then(() => {
                console.log('Mongodb is live!')
                next()
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({
                    status: false,
                    message: 'Database doesn\'t work'
                })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Database doesn\'t work'
        })
    }
})
// login route
app.post('/login', async (req, res) => {
    let user = await User.login(req.body)
    res.json(user)
})
// Register route
app.post('/register',  async(req, res) => {
    let user =  await User.register(req.body)
    res.status(user.status).json(user)
    
})
// Home route
app.get('/', (req, res) => {
    res.json({
        status: 'ok'
    })
})

app.listen(3000, () => {
    console.log('Listening 3000');

})