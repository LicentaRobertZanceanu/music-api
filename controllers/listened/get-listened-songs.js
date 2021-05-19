import { ListenedModel } from '../../models/listened.js'
import { getSongById } from '../../globals/functions/index.js'

export const getListenedSongs = async (req, res) => {
    const findRes = {
        isError: false,
        result: null
    }

    await ListenedModel.find({ userId: req.loggedInUser._id }, (err, docs) => {
        if (err) {
            findRes.isError = true
            findRes.result = err
            return
        }

        findRes.result = docs
        return
    })

    if (findRes.isError) {
        res.status(400).json({ message: err })
        return
    }

    const songsDetails = []

    await Promise.all(findRes.result.map(async (record) => {
        const getSongResult = await getSongById(record.songId)
        if (getSongResult.status === 200) {
            songsDetails.push(getSongResult.result)
        }
    }))

    res.json(songsDetails)
    return
}