const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const User = require('./controller/user')
const mongoose = require('mongoose')
const configs = require('./configs')
const cookieParser = require('cookie-parser')

app.use('/users', require('./route/users'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

// connect mongoose
mongoose.connect(configs.mongodburl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('Mongodb is live!')
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            error: true,
            message: 'Database doesn\'t work'
        })
    })

// login route
app.post('/login', async (req, res) => {
    let user = await User.login(req.body)
    try {
        if (user.status == 200) {
            res.cookie('access_token', user.token, { maxAge: configs.cookieExpirationTime, httpOnly: true })
            delete user.token
        }

        res.status(user.status).json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: 'Cookie error'
        })
    }
})
// Register route
app.post('/register', async (req, res) => {
    let user = await User.register(req.body)
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