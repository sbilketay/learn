const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const database = require('../services/helper/database');
const auth = require('../services/helper/auth_verify')


router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(cookieParser())


// Session control middleware
router.use(auth.verify);

router.get('/', async (req, res) => {
    res.json({
        status: 'ok',
    });
});

// Media post
router.post('/create', async (req, res) => {

    const netflixId = 812128990;
    let user = await database.getUserInfos(req.user.userid);

    const { watch, details, credits, images } = req.body;

    try {

        const mediaResult = await database.getNetflixIdAndUserResult(netflixId);

        let media;
        // netflix id sine ait media mevcut mu
        if (mediaResult) {
            mediaUserQuery = await database.getNetflixIdAndUserResult(netflixId, user);
            // mevcut ise, medianın altında kullanıcı kayıtlı mı
            if (mediaUserQuery == '') {
                // mevcut kullanıcı medianın altında daha önce kayıtlı değilse kaydet
                media = await database.updateUserOnMedia(netflixId, user);
                // kaydedilen mediayı user altına da kaydet
                await database.updateMediaOnUser(user, mediaResult)
            } else {
                // mevcut kullanıcı daha önce kayıtlı ise hata gönder
                throw new Error('User already saved!');
            }
        } else {
            // netflix id sine ait media yoksa oluştur
            media = await database.createMedia(user, netflixId, watch, details, credits, images);
            // kaydedilen mediayı user altına da kaydet
            await database.updateMediaOnUser(user, media);
        }

        return res.json({
            status: 200,
            error: false,
            data: media
        })
    } catch (error) {
        // Mongodb Save Error
        console.log(error.message);
        return res.json({
            status: 401,
            error: true,
            message: error.message || 'Doesn\'t save'
        })
    }
});

module.exports = router