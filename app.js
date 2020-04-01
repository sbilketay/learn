const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const configs = require('./configs')
const Main = require('./controller/Main')
const chalk = require('chalk')
const morgan = require('morgan')
const redisService = require('./services/redis')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('./public'))

// Logger
app.use(morgan('dev'))

// Connect Mongoose
mongoose.connect(configs.mongodburl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log(chalk.cyanBright.bold('Mongodb is live!'))
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            error: true,
            message: 'Database doesn\'t work'
        })
    })

// Redis Service Start
redisService.init();
// Set cache (first 5 record and 1 hours exp time)
redisService.initCache(15, 3600);

// User Route
app.use('/user', require('./route/user'))
// Media Route
app.use('/media', require('./route/media'))
// Api Route
app.use('/api', require('./route/api'))
// Login Route
app.post('/login', async (req, res) => {
    let guest = await Main.login(req.body)
    try {
        if (guest.status == 200) {
            // RememberMe check
            if (req.body.rememberMe == 'true') {
                res.cookie('access_token', guest.token, {
                    maxAge: configs.cookieExpirationTimeRememberTrue,
                    httpOnly: true
                })
            } else {
                res.cookie('access_token', guest.token, {
                    maxAge: (configs.cookieExpirationTimeRememberFalse),
                    httpOnly: true
                })
            }
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
    let guest = await Main.register(req.body)
    res.status(guest.status).json(guest)
})
// Home route
app.get('/', (req, res) => {
    res.json({
        status: 'ok'
    })
})
// Server Listening
app.listen(process.env.PORT || configs.port, () => { console.log(chalk.yellowBright.bold.bgGreen('Listening: ' + configs.port)) })
// Error Handling
app.on('eror', (error) => { console.log(error) })