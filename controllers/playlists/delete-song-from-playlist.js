import { PlaylistSongsModel } from '../../models/index.js'

export const deleteSongFromPlaylist = async (req, res) => {
    PlaylistSongsModel.deleteOne({
        playlistId: req.params.playlistId
    }, (err, result) => {
        if (err) {
            res.status(400).json({ message: `Couldn't delete song from playlist!` })
            return
        }

        res.json({ message: 'Song deleted successfully' })
        return
    })
    return
}