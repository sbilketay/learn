const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const flixinfoService = require('../services/flixinfo_api')
const dbApiService = require('../services/db_api')
const auth = require('../services/helper/auth_verify')
const ApiController = require('../controller/Api')


router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(cookieParser())

// Session control middleware
router.use(auth.verify);

// Netlfix id sine göre media ara ve getir
router.get('/media/get/:netflix_id/:language', async (req, res) => {

    const netflix_id = req.params.netflix_id;
    const language = req.params.language;

    try {
        const result = await ApiController.searchMediaByNetflixId(netflix_id, language);

        if (result.status != 200) {
            return res.status(result.status).json({
                status: 400,
                error: true,
                message: result.message
            });
        } else {
            return res.status(result.status).json({
                status: 200,
                error: false,
                data: result.data
            });
        }
    } catch (error) {
        return res.json({
            status: 400,
            error: true,
            message: error.message
        })
    }
})

module.exports = router