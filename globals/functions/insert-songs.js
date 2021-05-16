import { SongsModel } from '../../models/index.js'

export const InsertSongs = async (songs) => {
    const response = {
        status: 200,
        insertedSongs: [],
        message: ''
    }
    await SongsModel
        .insertMany(songs)
        .then((data) => {
            console.log('songs inserted', data)
            response.insertedSongs.push(...data)
        })
        .catch(err => {
            response.status = 400
            response.message = err
        })
    return response
}