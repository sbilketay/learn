const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const configs = require('../../configs')
const Jwt = require('../../controller/libs/jwt')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(cookieParser())


// Verify Token Middleware
const verify = async (req, res, next) => {
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
        console.log('Error: payload null');
        return res.json({
            status: 401,
            error: true,
            message: 'Authorization error'
        })
    }
}

module.exports = { verify }
