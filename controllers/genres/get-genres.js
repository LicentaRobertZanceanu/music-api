import {getGenresByConditions} from '../../globals/functions/index.js'

export const getGenres = async (req, res) => {
   const findResult = await getGenresByConditions()
   res.status(findResult.status).json(findResult.result)
}