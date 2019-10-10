const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const configs = require('./configs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Connect Mongoose
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
// User Route
app.use('/user', require('./route/user'))
// Login Route
app.post('/login', async (req, res) => {
    let guest = await Guest.login(req.body)
    try {
        if (guest.status == 200) {
            res.cookie('access_token', guest.token, {
                maxAge: configs.cookieExpirationTime,
                httpOnly: true
            })
            delete guest.token
        }
        res.status(guest.status).json(guest)
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
    let guest = await Guest.register(req.body)
    res.status(guest.status).json(guest)
})
// Home route
app.get('/', (req, res) => {
    res.json({
        status: 'ok'
    })
})

// Server Listening
app.listen(3000, () => { console.log('Listening 3000') })
// Error Handling
app.on('eror', (error) => { console.log(error.message) })