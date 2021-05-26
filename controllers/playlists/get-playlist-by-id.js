import { PlaylistsModel } from '../../models/index.js'

export const getPlaylistById = async (req, res) => {
    PlaylistsModel.findOne({ _id: req.params.playlistId }, (err, doc) => {
        if (err) {
            res.status(404).json({ message: 'Playlist not found!' })
            return
        }
        if (doc.createdBy !== req.loggedInUser._id) {
            res.status(403).json({ message: `You don't have access to this playlist!` })
            return
        }
        res.json(doc)
        return
    })
    return
}