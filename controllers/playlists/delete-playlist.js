import { PlaylistsModel, PlaylistSongsModel } from '../../models/index.js'

export const deletePlaylist = async (req, res) => {
    const playlistId = req.params.playlistId
    PlaylistSongsModel.deleteMany(
        { playlistId }, (err, resultDeleteMany) => {
            if (err) {
                res.status(400).json({ message: `Couldn't delete songs from playlist!` })
                return
            }

            PlaylistsModel.deleteOne(
                { _id: playlistId }, (errDeletePlaylist, resultDelete) => {
                    if (errDeletePlaylist) {
                        res.status(400).json({ message: `Couldn't delete playlist!` })
                        return
                    }
                    res.json({ message: 'Playlist deleted successfully!' })
                    return
                })
        })

    return
}