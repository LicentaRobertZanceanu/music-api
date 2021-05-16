import mongoose from 'mongoose'

const SongsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastFmId: { type: String, required: true },
    lastFmUrl: { type: String, required: true },
    youtubeUrl: { type: String },
    image: { type: String },
    genre: {
        _id: String,
        name: String
    },
    artist: {
        _id: String,
        name: String,
        lastFmId: String
    }
})

export const SongsModel = mongoose.model('Songs', SongsSchema)