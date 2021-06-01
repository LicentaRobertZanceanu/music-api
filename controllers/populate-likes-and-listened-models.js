import { USERS_MICROSERVICE_API } from "../globals/constants.js"
import { callApi } from "../globals/functions/index.js"
import { GenresModel, SongsModel, LikesModel, ListenedModel } from '../models/index.js'

const getAllUsers = async (token) => {
    const options = {
        uri: `${USERS_MICROSERVICE_API}/users`,
        headers: {
            authorization: token
        }
    }
    return new Promise(async (resolve) => {
        try {
            const response = await callApi(options)
            resolve({
                status: 200,
                body: response
            })
        } catch (error) {
            resolve({
                status: error.status,
                body: error.body
            })
        }
    })
}

export const generateNewEntries = async (genreId, userId) => {
    const numberOfSongs = Math.round((Math.random() * 30) + 10)
    let listenedDocumentsToAdd = []
    let likedDocumentsToAdd = []

    return new Promise((resolve) => {
        SongsModel.aggregate([
            { $match: { 'genre._id': String(genreId) } },
            { $sample: { size: numberOfSongs } },
        ]).exec((err, docs) => {
            if (err) {
                res.status(400).json({ message: 'Songs aggregation error!' })
                resolve({
                    listenedDocumentsToAdd: [],
                    likedDocumentsToAdd: []
                })
            }

            let songsIndex = 0
            while (songsIndex < numberOfSongs) {
                const song = docs[songsIndex]
                console.log(songsIndex)
                const numberOfEntriesToAdd = Math.round((Math.random() * 10) + 1)
                const objectToAdd = {
                    songId: song._id,
                    userId: userId
                }

                const toAddInListened = appendXCopiesOfElement(numberOfEntriesToAdd, objectToAdd)
                listenedDocumentsToAdd = [...listenedDocumentsToAdd, ...toAddInListened]

                const addInLikedSongs = Math.round(Math.random())
                if (addInLikedSongs) {
                    likedDocumentsToAdd.push(objectToAdd)
                }

                songsIndex += 1
            }

            resolve({
                listenedDocumentsToAdd,
                likedDocumentsToAdd
            })
        })
    })
}

const appendXCopiesOfElement = (numberOfCopies, element) => {
    const elements = []
    for (let i = 0; i < numberOfCopies; i++) elements.push(element)

    return elements
}

const getRandomGenres = async () => {
    return new Promise(async (resolve) => {
        await GenresModel.aggregate([
            { $sample: { size: 3 } }
        ]).exec((err, docs) => {
            if (err) {
                resolve({
                    docs: err,
                    status: 400
                })
                return
            }
            resolve({
                docs,
                status: 200
            })
            return
        })
    })
}

export const populateLikesAndListenedModels = async (req, res) => {
    const users = await getAllUsers(req.headers.authorization)
    if (users.status >= 400) {
        res.status(users.status).json({ message: res.body })
        return
    }
    let listenedDocumentsToAdd = []
    let likedDocumentsToAdd = []

    let index = 0
    while (index < users.body.length) {
        const user = users.body[index]
        const genresResult = await getRandomGenres()

        if (genresResult.status >= 400) {
            res.status(genresResult.status).json({ message: genresResult.docs })
            return
        }

        const genres = genresResult.docs

        for (let i = 0; i < 3; i++) {
            const genre = genres[i]
            console.log(user)

            const result = await generateNewEntries(genre._id, user._id)
            listenedDocumentsToAdd = [...listenedDocumentsToAdd, ...result.listenedDocumentsToAdd]
            likedDocumentsToAdd = [...likedDocumentsToAdd, ...result.likedDocumentsToAdd]
        }
        index += 1
    }

    // const randomNumber = Math.round((Math.random() * 30) + 10)
    // console.log(randomNumber, Math.round(randomNumber))
    // }

    // res.json(users.body)
    console.log('length of listened docs to add', listenedDocumentsToAdd.length)
    console.log('length of liked docs to add', likedDocumentsToAdd.length)

    LikesModel.insertMany(likedDocumentsToAdd, (err,result) => {
        if(err) {
            return
        }
        console.log('ok LikesModel')
        return
    })

    ListenedModel.insertMany(listenedDocumentsToAdd, (err,result) => {
        if(err) {
            return
        }
        console.log('ok ListenedModel')
        return
    })

    res.json({
        listenedDocumentsToAdd,
        likedDocumentsToAdd
    })
    return
}