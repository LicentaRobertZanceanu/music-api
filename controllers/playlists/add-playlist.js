import { PlaylistsModel } from '../../models/index.js'

export const addPlaylist = async (req, res) => {
    const newPlaylist = new PlaylistsModel({
        name: req.body.name,
        createdBy: req.loggedInUser._id
    })
    newPlaylist.save((err, playlist) => {
        if (err) {
            res.status(400).json({ message: err })
            return
        }

        res.json(playlist)
        return
    })

    return
}