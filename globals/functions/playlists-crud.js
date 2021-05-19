import { PlaylistsModel } from '../../models/index.js'

export const getPlaylistById = async (_id) => {
    return new Promise((resolve) => {
        PlaylistsModel.findOne({ _id }, (err, playlist) => {
            if (err) {
                resolve({
                    status: 404,
                    response: "No playlist found"
                })
                return
            }
            resolve({
                status: 200,
                response: playlist
            })
        })
    })
}

export const checkUserAccessToPlaylist = async (loggedInUserId, playlistId) => {
    return new Promise(async (resolve) => {
        const { status, response } = await getPlaylistById(playlistId)
        if (status >= 400) {
            resolve({
                status,
                response
            })
            return
        }

        if (response.createdBy !== loggedInUserId) {
            resolve({
                status: 403,
                response: `You don't have access to this playlist!`
            })
            return
        }

        resolve({
            status: 200,
            response: 'OK'
        })

        return
    })
}