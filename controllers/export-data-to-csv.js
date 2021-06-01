import { getSongsByConditions, getListenedSongsByConditions, getLikedSongsByConditions } from '../globals/functions/index.js'
import { SongsModel, ListenedModel, LikesModel } from '../models/index.js'
import fs from 'fs'
import json2csv from 'json2csv'
const { Parser } = json2csv

const transformJsonToCsv = async (json, fields) => {
    return new Promise((resolve) => {
        const csvParser = new Parser({ fields: fields })
        const csv = csvParser.parse(json)
        resolve(csv)
    })
}

const writeCsvToFile = async (csv, path) => {
    return new Promise((resolve) => {
        fs.writeFileSync(path, csv, { encoding: 'utf-8' })
        resolve(true)
    })
}

export const exportToCsv = async (req, res) => {
    //create songs csv
    const songsResult = await getSongsByConditions({}, 0, 1)
    if (songsResult.status >= 400) {
        res.status(songsResult.status).json({ message: 'Error' })
    }
    const songs = songsResult.result.documents
    const songsCsvFields = ['_id', 'name', 'genre._id', 'genre.name', 'artist._id', 'artist.name']
    const songsCsv = await transformJsonToCsv(songs, songsCsvFields)
    await writeCsvToFile(songsCsv, './songs.csv')
    console.log(songsCsv)

    const likedAndListenedCsvFields = ['songId', 'userId']

    //create liked csv
    const likedResult = await getLikedSongsByConditions({})
    if (likedResult.status >= 400) {
        res.status(likedResult.status).json({ message: likedResult.result.message })
        return
    }

    const likedSongs = likedResult.result
    const likedCsv = await transformJsonToCsv(likedSongs, likedAndListenedCsvFields)
    await writeCsvToFile(likedCsv, './liked.csv')

    // //create listened csv
    const listenedResult = await getListenedSongsByConditions({})
    if (listenedResult.status >= 400) {
        res.status(listenedResult.status).json({ message: listenedResult.result.message })
        return
    }

    const listenedSongs = listenedResult.result
    const listenedCsv = await transformJsonToCsv(listenedSongs, likedAndListenedCsvFields)
    await writeCsvToFile(listenedCsv, './listened.csv')

    res.json({
        songs,
        listenedSongs,
        likedSongs
    })
}