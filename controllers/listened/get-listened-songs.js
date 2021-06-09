import { ListenedModel } from '../../models/listened.js'
import { getSongById, getListenedSongsPromise } from '../../globals/functions/index.js'

export const getListenedSongs = async (req, res) => {
    const { page, limit } = req.query

    const findRes = await getListenedSongsPromise(parseInt(limit), parseInt(page), req.loggedInUser._id)
    if (findRes.status >= 400) {
        res.status(400).json({ message: findRes.error })
        return
    }
    const songsDetails = []

    await Promise.all(findRes.documents.map(async (record) => {
        const getSongResult = await getSongById(record.songId, req.loggedInUser._id)
        if (getSongResult.status === 200) {
            songsDetails.push(getSongResult.result)
        }
    }))

    res.json({
        documents: songsDetails,
        total: findRes.total,
        page: findRes.page,
        pageSize: findRes.pageSize,
        numberOfPages: findRes.numberOfPages
    })
    return
}