import { getSongById } from '../../globals/functions/index.js'

export const getSongByIdController = async (req, res) => {
    const findResult = await getSongById(req.params.id)
    if (findResult.status >= 400) {
        res
            .status(findResult.status)
            .json(findResult.result)
        return
    }

    res.json(findResult.result)
    return
}