const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const UserModel = require('../models/users')
const User = require('../controller/User')
const auth = require('../services/helper/auth_verify')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(cookieParser())

// Session control middleware
router.use(auth.verify);

// Main route (/user)
router.get('/', async (req, res) => {
    try {
        let user = await UserModel.findOne({ _id: req.user.userid }).populate("media").select({ "password": 0, "_id": 0, "verifyMail": 0 })
        if (!user) throw new Error('User not found ')
        return res.json({
            status: 200,
            error: false,
            data: user
        })
    } catch (error) {
        return res.json({
            status: 401,
            error: true,
            message: error.message
        })
    }
})
// Avatar Upload route
router.put('/avatar', async (req, res) => {
    const file = await User.avatar.upload(req, res)
    res.status(file.status).json(file)

});

module.exports = router