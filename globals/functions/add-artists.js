import { ArtistsModel } from '../../models/index.js'

export const InsertArtists = async (artists) => {
    const response = {
        status:200,
        insertedArtists:[],
        message:''
    }
    await ArtistsModel
        .insertMany(artists)
        .then((data) => {
            response.insertedArtists.push(...data)
        })
        .catch(err => {
            response.status = 400
            response.message = err
        })
    return response
}