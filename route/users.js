const express = require('express')
const router = express.Router()
const Jwt = require('../controller/jwt')
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({extended: false}))
router.use(bodyParser.json())

router.use(async(req, res, next) => {
    try{
        let payload = await Jwt.verify(req.query.token)
        if(!payload){
            return res.json({
                error: 'not_verified!'
            })
        }
        req.user = payload
        next();

    }
    catch(err){
        return json({err: 'not_verified'})
    }
})

router.get('/', (req, res) => {
    res.send('user route.')
})

router.get('/:id', (req, res) => {
    res.send('')
})

module.exports = router