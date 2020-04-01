const MediaModel = require('../models/media');
const UserModel = require('../models/users');
const databaseHelper = require('../services/helper/database');
const flixinfoService = require('../services/flixinfo_api');
const configs = require('../configs');
const dbApiService = require('../services/db_api');
// const redisService = require('../services/redis');
const chalk = require('chalk');

const searchMediaByNetflixId = async (netflix_id, language) => {

    let result;

    try {

        // 1 - Aranan netflix id sine ait media bilgisi redis cache de varmı
        // const resultRedisCahce = await redisService.searchRedisCache(netflix_id);
        const resultRedisCahce = false
        if (resultRedisCahce) {
            console.log(chalk.bgYellowBright.black.bold(' Data came from the cache 🏎️  '));
            return {
                status: 200,
                error: false,
                data: resultRedisCahce
            }
        } else {
            // 2 - Aranan netflix id sine ait media bilgisi database de varmı
            const resultDatabase = await dbApiService.getNetflixMediaInfoByIdOnDatabase(netflix_id);
            // Databasede var ise sonucu döndür
            if (resultDatabase) {
                console.log(chalk.bgYellowBright.black(' Data came from the database 🚗 '));
                return {
                    status: 200,
                    error: false,
                    data: resultDatabase
                }
            } else {
                // Databasede yok ise flixinfo apiye bağlan ve ara
                let resultFlixinfo = await flixinfoService.getNetflixMediaInfoByIdOnFlixinfo(netflix_id, language);
                // Flixinfodan bulunamadı ise hata döndür
                if (resultFlixinfo.error) {
                    return {
                        status: 400,
                        error: true,
                        message: resultFlixinfo.errorMsg
                    }
                } else {
                    // Arama yapılan dile ait açıklama (overview) mevcut mu
                    if (!resultFlixinfo.details.overview) {
                        // Mevcut değilse default language ile tekrar arama yap
                        resultFlixinfo = await flixinfoService.getNetflixMediaInfoByIdOnFlixinfo(netflix_id, configs.defaultLanguage);
                    }
                    // Flixinfodaki sonucu database'e kaydet
                    await databaseHelper.createMedia(netflix_id, resultFlixinfo.watch, resultFlixinfo.details, resultFlixinfo.credits, resultFlixinfo.images, resultFlixinfo.trailers);
                    // Flixinfoda bulunan sonucu database'e kaydedildi ve sonuç döndürüldü
                    console.log(chalk.bgYellowBright.black(' Data came from the Flixinfo API 🐫 '));
                    return {
                        status: 200,
                        error: false,
                        data: resultFlixinfo
                    }
                }
            }
        }
    } catch (error) {
        return error;
    }
}

module.exports = { searchMediaByNetflixId }