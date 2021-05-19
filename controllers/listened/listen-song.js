import { ListenedModel } from '../../models/listened.js'

export const listenSong = async (req, res) => {
    const newListenedSong = new ListenedModel({
        songId: req.params.songId,
        userId: req.loggedInUser._id
    })

    newListenedSong.save((err, result) => {
        if (err) {
            res.status(400).json({ message: err })
            return
        }

        res.json(result)
        return
    })

    return
}