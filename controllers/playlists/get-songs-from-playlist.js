import { PlaylistSongsModel } from '../../models/index.js'
import { getSongById, checkUserAccessToPlaylist } from '../../globals/functions/index.js'

export const getSongsFromPlaylist = async (req, res) => {
    const { playlistId } = req.params

    const accessResponse = await checkUserAccessToPlaylist(req.loggedInUser._id, playlistId)
    if (accessResponse.status >= 400) {
        res.status(accessResponse.status).json({ message: accessResponse.response })
        return
    }

    const songs = {
        isError: false,
        response: null
    }

    await PlaylistSongsModel.find({ playlistId }, (err, docs) => {
        if (err) {
            songs.isError = true
            songs.response = err
            return
        }

        songs.response = docs
        return
    })

    const { isError, response } = songs

    if (isError) {
        res.status(400).json({ message: response })
        return
    }

    const songsDetails = []

    await Promise.all(response.map(async (record) => {
        const getSongResult = await getSongById(record.songId, req.loggedInUser._id)
        if (getSongResult.status === 200) {
            songsDetails.push(getSongResult.result)
        }
    }))

    res.json(songsDetails)
    return
}