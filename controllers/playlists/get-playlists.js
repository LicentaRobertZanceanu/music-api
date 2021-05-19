import { PlaylistsModel } from '../../models/index.js'

export const getLoggedInUsersPlaylists = async (req, res) => {
    PlaylistsModel.find({ createdBy: req.loggedInUser._id }, (err, docs) => {
        if (err) {
            res.status(400).json({ message: error })
            return
        }

        res.json(docs)
        return
    })

    return
}