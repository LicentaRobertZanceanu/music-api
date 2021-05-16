import { getSongsByConditions } from '../../globals/functions/index.js'

export const getSongsFromDb = async (req, res) => {
    const { page, limit, genreId, artistId } = req.query

    const conditions = {}
    if (genreId) {
         conditions['genre._id'] = genreId
    }
    if (artistId) {
        conditions['artist._id'] = artistId
    }

    const findResult = await getSongsByConditions(conditions, parseInt(limit), parseInt(page))
    if (findResult.status >= 400) {
        res
            .status(findResult.status)
            .json({ message: findResult.result })
        return
    }
    res.json(findResult.result)
    return
}