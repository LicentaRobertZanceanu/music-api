import {
    getSongs,
    getGenres,
    addGenres,
    getSongsWithoutYtUrl,
    getSongsFromDb,
    getSongByIdController,
    getArtists,
    getArtistByIdController
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

    app.route('/genres')
        .post(checkAuthentication, addGenres)
        .get(checkAuthentication, getGenres)

}