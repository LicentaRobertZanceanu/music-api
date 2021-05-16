import mongoose from 'mongoose'

const PlaylistSongsSchema = new mongoose.Schema({
    songId: { type: String, required: true },
    playlistId: { type: String, required: true }
})

export const PlaylistSongsModel = mongoose.model('PlaylistSongs', PlaylistSongsSchema)