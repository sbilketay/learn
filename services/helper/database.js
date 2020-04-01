const MediaModel = require('../../models/media');
const UserModel = require('../../models/users');
const chalk = require('chalk')

module.exports = {
    // Netflix Id ve user bilgilerine göre media sonuçlarını getirir
    getNetflixIdAndUserResult: async (netflix_id, users = false) => {
        if (!users) {
            result = await MediaModel.findOne({ netflix_id });
        } else {
            result = await MediaModel.find({ netflix_id, users });
        }
        return result;
    },
    // User id ye göre user bilgilerini getir
    getUserInfos: async (userid) => {
        // oturum açmış olan user bilgilerini getir
        user = await UserModel.findById({ '_id': userid })
        return user;
    },
    // Media üzerindeki kullanıcı bilgilerini güncelle (yeni kullanıcı ekle)
    updateUserOnMedia: async (netflix_id, new_user) => {
        return await MediaModel.updateOne({ netflix_id }, { $push: { users: new_user } });
    },
    // User üzerindeki media bilgilerini güncelle (yeni media ekle)
    updateMediaOnUser: async (user, new_media) => {
        return await UserModel.updateOne({ username: user.username, email: user.email }, { $push: { media: new_media } })
    },
    // Yeni media kaydet (Flixinfo API den gelen dataları kaydet)
    createMedia: async (netflix_id, watch, details, credits, images, trailers) => {
        try {
            console.log(chalk.yellow('New media created: ') + chalk.white.bgGrey(netflix_id));
            return await MediaModel.create({ netflix_id, watch, details, credits, images, trailers })
        } catch (error) {
            console.error(chalk.red(error.message));
        }
    },
    // Redis için ilk 5 media kaydını getir
    getMediaForRedisCache: async (cacheLength) => {
        try {
            return await MediaModel.find().limit(cacheLength);
        } catch (error) {
            console.error(chalk.red(error.message));
        }
    }
}

