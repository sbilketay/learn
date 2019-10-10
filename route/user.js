const express = require('express')
const router = express.Router()
const Jwt = require('../controller/jwt')
const bodyParser = require('body-parser')
const configs = require('../configs')
const cookieParser = require('cookie-parser')
const UserModel = require('../models/users');

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
        if (payload.remember == 'false') {
            let token = await Jwt.create({ userid: payload.userid, remember: payload.remember })
            res.cookie('access_token', token, {
                maxAge: (configs.cookieExpirationTimeRemeberFalse),
                httpOnly: true
            })
        }
        req.user = payload
        next();
    }
    catch (err) {
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
            user_id: user._id,
            username: user.username,
            email: user.email,
        })
    } catch (error) {
        return {
            status: 401,
            error: true,
            message: error.message
        }
    }
})

module.exports = router