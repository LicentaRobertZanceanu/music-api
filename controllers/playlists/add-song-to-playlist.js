import { PlaylistSongsModel } from '../../models/index.js'
import { checkUserAccessToPlaylist } from '../../globals/functions/index.js'

export const addSongToPlaylist = async (req, res) => {
    const { playlistId, songId } = req.params

    const accessResponse = await checkUserAccessToPlaylist(req.loggedInUser._id, playlistId)
    if (accessResponse.status >= 400) {
        res.status(accessResponse.status).json({ message: accessResponse.response })
        return
    }

    const newPlaylistsSong = new PlaylistSongsModel({
        songId: songId,
        playlistId: playlistId
    })

    newPlaylistsSong.save((err, entry) => {
        if (err) {
            res.status(400).json({ message: err })
            return
        }

        res.json(entry)
        return
    })
}