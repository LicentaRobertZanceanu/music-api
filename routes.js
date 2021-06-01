import {
    getSongs,
    getGenres,
    addGenres,
    getSongsWithoutYtUrl,
    getSongsFromDb,
    getSongByIdController,
    getArtists,
    getArtistByIdController,
    addPlaylist,
    getLoggedInUsersPlaylists,
    getSongsFromPlaylist,
    addSongToPlaylist,
    dislikeSong,
    getLikedSongs,
    likeSong,
    getListenedSongs,
    listenSong,
    getGenresById,
    deletePlaylist,
    deleteSongFromPlaylist,
    getPlaylistById,
    populateLikesAndListenedModels,
    exportToCsv
} from "./controllers/index.js"
import { checkAccessToEndpoint, checkAuthentication } from './globals/functions/index.js'

export const routes = (app) => {
    app.route('/lastfm/songs')
        .get(checkAccessToEndpoint, getSongs)

    app.route('/songs')
        .get(checkAuthentication, getSongsFromDb)
    app.route('/songs/:id')
        .get(checkAuthentication, getSongByIdController)
    app.route('/songs/no-yt-url')
        .get(getSongsWithoutYtUrl)

    app.route('/artists')
        .get(checkAuthentication, getArtists)
    app.route('/artists/:id')
        .get(checkAuthentication, getArtistByIdController)

    app.route('/playlists')
        .post(checkAuthentication, addPlaylist)
        .get(checkAuthentication, getLoggedInUsersPlaylists)
    app.route('/playlists/:playlistId')
        .get(checkAuthentication, getPlaylistById)
        .delete(checkAuthentication, deletePlaylist)
    app.route('/playlists/:playlistId/songs')
        .get(checkAuthentication, getSongsFromPlaylist)
    app.route('/playlists/:playlistId/songs/:songId')
        .post(checkAuthentication, addSongToPlaylist)
        .delete(checkAuthentication, deleteSongFromPlaylist)

    app.route('/likes')
        .get(checkAuthentication, getLikedSongs)
    app.route('/likes/:songId')
        .post(checkAuthentication, likeSong)
        .delete(checkAuthentication, dislikeSong)

    app.route('/listened/:songId')
        .post(checkAuthentication, listenSong)
    app.route('/listened')
        .get(checkAuthentication, getListenedSongs)

    app.route('/genres')
        .post(checkAuthentication, addGenres)
        .get(checkAuthentication, getGenres)
    app.route('/genres/:id')
        .get(checkAuthentication, getGenresById)

    app.route('/populate-models')
        .post(checkAuthentication, populateLikesAndListenedModels)

    app.route('/export-to-csv')
        .post(checkAuthentication, exportToCsv)
}