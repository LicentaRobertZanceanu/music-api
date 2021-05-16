import mongoose from 'mongoose'

const PlaylistsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdBy: { type: String, required: true }
})

export const PlaylistsModel = mongoose.model('Playlists', PlaylistsSchema)