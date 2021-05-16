import { getArtistsByConditions } from '../../globals/functions/index.js'

export const getArtists = async (req, res) => {
    const { page, limit } = req.query
    const findResult = await getArtistsByConditions({}, parseInt(limit), parseInt(page))
    if (findResult.status >= 400) {
        res
            .status(findResult.status)
            .json({ message: findResult.result })
        return
    }
    res.json(findResult.result)
    return
}