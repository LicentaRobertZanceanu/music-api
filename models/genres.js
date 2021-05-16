import mongoose from 'mongoose'

const GenresSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastFmTag: { type: String, required: true }
})

GenresSchema.index({
    name: true,
    lastFmTag: true
})

export const GenresModel = mongoose.model('Genres', GenresSchema)
