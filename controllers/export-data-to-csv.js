import { getSongsByConditions, getListenedSongsByConditions, getLikedSongsByConditions } from '../globals/functions/index.js'
import { SongsModel, ListenedModel, LikesModel } from '../models/index.js'
import fs from 'fs'
import json2csv from 'json2csv'
import { s3 } from '../index.js'

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

const saveFilesToAWSS3 = async () => {
    const songsCsv = fs.readFileSync('./songs.csv')
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: 'songs.csv',
        Body: songsCsv
    }
    console.log('songs', songsCsv)
    s3.upload(params, (err, data) => {
        if (err) {
            console.log('err', err)
            return
        }
        console.log(data)
    })

    const listenedCsv = fs.readFileSync('./listened.csv')
    const paramsListened = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: 'listened.csv',
        Body: listenedCsv
    }
    console.log('listened', listenedCsv)
    s3.upload(paramsListened, (err, data) => {
        if (err) {
            console.log('err', err)
            return
        }
        console.log(data)
    })

    const likedCsv = fs.readFileSync('./liked.csv')
    const paramsLiked = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: 'liked.csv',
        Body: likedCsv
    }
    console.log('likedCsv', likedCsv)
    s3.upload(paramsLiked, (err, data) => {
        if (err) {
            console.log('err', err)
            return
        }
        console.log(data)
    })
}

export const exportToCsv = async (req, res) => {
    //create songs csv
    const songsResult = await getSongsByConditions({}, 0, 1)
    if (songsResult.status >= 400) {
        res.status(songsResult.status).json({ message: 'Error' })
    }
    const songs = songsResult.result.documents
    const songsCsvFields = ['_id', 'name', 'genre._id', 'genre.name', 'artist._id', 'artist.name', 'image']
    const songsCsv = await transformJsonToCsv(songs, songsCsvFields)
    await writeCsvToFile(songsCsv, './songs.csv')
    console.log(songsCsv)

    const likedAndListenedCsvFields = ['songId', 'userId']

    //create liked csv
    const likedResult = await getLikedSongsByConditions({})
    if (likedResult.status >= 400) {
        console.log('liked', likedResult)
        res.status(likedResult.status).json({ message: likedResult.result.message })
        return
    }

    const likedSongs = likedResult.result
    const likedCsv = await transformJsonToCsv(likedSongs, likedAndListenedCsvFields)
    await writeCsvToFile(likedCsv, './liked.csv')

    //create listened csv
    const listenedResult = await getListenedSongsByConditions({})
    if (listenedResult.status >= 400) {
        console.log('listened', listenedResult)
        res.status(listenedResult.status).json({ message: listenedResult.result.message })
        return
    }

    const listenedSongs = listenedResult.result
    const listenedCsv = await transformJsonToCsv(listenedSongs, likedAndListenedCsvFields)
    await writeCsvToFile(listenedCsv, './listened.csv')

    await saveFilesToAWSS3()

    res.json({
        songs,
        listenedSongs,
        likedSongs
    })
}