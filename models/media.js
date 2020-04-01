const mongoose = require('mongoose')
const beautifyUnique = require('mongoose-beautiful-unique-validation');


const Schema = mongoose.Schema

// Main media schema
const mediaSchema = new Schema({
    netflix_id: Number,
    watch: String,
    details: Object,
    credits: Object,
    images: Object,
    trailers: Object,
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

mediaSchema.plugin(beautifyUnique)
const Media = mongoose.model('Media', mediaSchema)
module.exports = Media