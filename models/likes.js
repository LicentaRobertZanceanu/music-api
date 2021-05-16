import mongoose from 'mongoose'

const LikesSchema = new mongoose.Schema({
    songId: { type: String, required: true },
    userId: { type: String, required: true }
})

export const LikesModel = mongoose.model('Likes', LikesSchema)