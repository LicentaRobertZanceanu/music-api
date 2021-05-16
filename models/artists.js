import mongoose from 'mongoose'

const ArtistsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastFmId: { type: String, required: true, unique: true }
})

export const ArtistsModel = mongoose.model('Artists', ArtistsSchema)