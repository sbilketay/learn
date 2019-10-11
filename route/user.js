const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const configs = require('../configs')
const UserModel = require('../models/users');
const Jwt = require('../controller/libs/jwt')
const User = require('../controller/User')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(cookieParser())

// Verify Token
router.use(async (req, res, next) => {
    try {
        let payload = await Jwt.verify(req.cookies.access_token, configs.secret)
        // Payload incorrect or empty throw Error
        if (!payload) throw new Error()
        // If the remember me option is not selected. Extend the cookie time.
        if (!Boolean(Number(payload.remember))) {
            let token = await Jwt.create({ userid: payload.userid, remember: payload.remember })
            res.cookie('access_token', token, {
                maxAge: (configs.cookieExpirationTimeRememberFalse),
                httpOnly: true
            })
        }
        req.user = payload
        next();
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 401,
            error: true,
            message: 'Authorization error'
        })
    }
})
// Main route (/user)
router.get('/', async (req, res) => {
    try {
        let user = await UserModel.findOne({ _id: req.user.userid })
        if (!user) throw new Error('User not found ')
        return res.json({
            status: 200,
            error: false,
            user_id: user._id,
            username: user.username,
            email: user.email,
        })
    } catch (error) {
        return res.json({
            status: 401,
            error: true,
            message: error.message
        })
    }
})

router.put('/avatar', async (req, res) => {

    const file = await User.avatar.upload(req, res)
    res.status(file.status).json(file)

})

module.exports = router