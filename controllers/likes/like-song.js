import { LikesModel } from '../../models/index.js'

export const likeSong = async (req, res) => {
    const { songId } = req.params

    const newLikedSong = new LikesModel({
        songId,
        userId: req.loggedInUser._id
    })

    newLikedSong.save((err, like) => {
        if (err) {
            res.status(400).json({ message: err })
            return
        }
        res.json(like)
        return
    })

    return
}