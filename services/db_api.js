// Model
const MediaModel = require('../models/media');

module.exports = {
    getNetflixMediaInfoByIdOnDatabase: async (netflix_id) => {
        try {
            const result = await MediaModel.findOne({ netflix_id });
            return result;
        } catch (error) {
            return error;
        }
    },
    deleteNetflixMediaInfoByIdOnDatabase: async (netflix_id) => {
        try {
            const result = await MediaModel.deleteOne({ netflix_id });
            return result;
        } catch (error) {
            return error;
        }
    }
}