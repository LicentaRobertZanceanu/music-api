import { checkIfSongIsLiked, getSongsByConditions } from '../../globals/functions/index.js'

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

    let currentIndex = 0
    const docs = []
    while (currentIndex < findResult.result.documents.length) {
        const song = findResult.result.documents[currentIndex]
        const likedResult = await checkIfSongIsLiked(song._id, req.loggedInUser._id)
        if (likedResult.status >= 400) {
            res
                .status(findResult.status)
                .json({ message: findResult.result })
            currentIndex = findResult.result.documents.length
            continue
        }
        song["_doc"].liked = likedResult.liked
        docs.push(song)
        currentIndex += 1
    }
    findResult.result.documents = docs
    res.json(findResult.result)
    return
}