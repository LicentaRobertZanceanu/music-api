import mongoose from 'mongoose'

const ListenedSchema = new mongoose.Schema({
    songId: { type: String, required: true },
    userId: { type: String, required: true }
})

export const ListenedModel = mongoose.model('Listened-songs', ListenedSchema)