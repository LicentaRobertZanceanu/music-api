import { getArtistById } from '../../globals/functions/index.js'

export const getArtistByIdController = async (req, res) => {
    const findResult = await getArtistById(req.params.id)
    if (findResult.status >= 400) {
        res
            .status(findResult.status)
            .json(findResult.result)
        return
    }

    res.json(findResult.result)
    return
}