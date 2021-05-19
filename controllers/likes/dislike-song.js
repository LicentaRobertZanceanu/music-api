import { LikesModel } from '../../models/index.js'

export const dislikeSong = async (req, res) => {
    const { songId } = req.params

    LikesModel.deleteOne({ songId }, (err, result) => {
        if (err) {
            res.status(400).json({ message: err })
            return
        }

        res.json({ message: "Song was disliked successfully!" })
        return
    })

    return
}