// Dependencies
const FlixInfo = require('flixinfo');
// Config
const configs = require('../configs');
// FlixInfo Instance
const flixinfo = new FlixInfo(configs.tmdbApiKey);

module.exports = {
    getNetflixMediaInfoByIdOnFlixinfo: async (netflix_id, language) => {
        try {
            return await flixinfo.get(netflix_id, language);
        } catch (error) {
            return error
        }
    }
}