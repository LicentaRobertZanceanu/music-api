import { LikesModel, SongsModel, ListenedModel } from '../../models/index.js'

export const UpdateOneSong = async (conditions, toUpdate) => {
    return await new Promise(async (resolve, reject) => {
        SongsModel.updateOne(conditions, toUpdate, (err, response) => {
            if (err) {
                resolve(false)
                return
            }
            resolve(true)
            return
        })
    })
}

export const DeleteOneSong = async (conditions) => {
    return await new Promise(async (resolve, reject) => {
        SongsModel.deleteOne(conditions, (err, response) => {
            if (err) {
                resolve(false)
                return
            }
            resolve(true)
            return
        })
    })
}

export const getSongsByConditions = (conditions, limit, page) => {
    return new Promise(async (resolve) => {
        SongsModel.
            find(conditions)
            .limit(limit)
            .skip((limit * page) - limit)
            .exec((err, docs) => {
                if (err) {
                    resolve({
                        status: 404,
                        result: {
                            message: 'Error!',
                        }
                    })
                    return
                }
                SongsModel.countDocuments(conditions, (countErr, count) => {
                    if (countErr) {
                        resolve({
                            status: 404,
                            result: {
                                message: 'Count error!',
                            }
                        })
                    } else {
                        resolve({
                            status: 200,
                            result: {
                                documents: docs,
                                total: count,
                                page,
                                pageSize: docs.length,
                                numberOfPages: Math.ceil(count / limit)
                            },
                        })

                        return
                    }
                })
                return
            })
    })
}

export const getSongById = (_id, userId) => {
    return new Promise(async (resolve, reject) => {
        await SongsModel.findOne({ _id }, async (err, doc) => {
            if (err) {
                resolve({
                    status: 404,
                    result: {
                        message: 'Song not found!',
                    }
                })
                return
            } else {
                const likedResult = await checkIfSongIsLiked(doc._id, userId)
                if (likedResult.status >= 400) {
                    resolve({
                        status: 404,
                        result: {
                            message: 'Song not found!',
                        }
                    })
                    return
                }
                doc["_doc"].liked = !!likedResult.liked
                resolve({
                    status: 200,
                    result: doc,
                })
                return
            }
        })
    })
}

export const checkIfSongIsLiked = async (songId, userId) => {
    return new Promise(async (resolve) => {
        await LikesModel.findOne({
            songId,
            userId
        }, (errLikes, liked) => {
            if (errLikes) {
                resolve({
                    status: 404,
                    result: {
                        message: 'Likes err'
                    }
                })
            }
            resolve({
                liked: !!liked,
                status: 200
            })
        })

        return
    })
}

export const getListenedSongsPromise = async (limit, page, userId) => {
    return new Promise((resolve) => {
        ListenedModel
            .find({ userId })
            .limit(limit)
            .skip((limit * page) - limit)
            .exec((err, docs) => {
                if (err) {
                    resolve({
                        status: 400,
                        error: err
                    })
                    return
                }
                ListenedModel
                    .countDocuments(
                        { userId },
                        (countErr, count) => {
                            if (countErr) {
                                resolve({
                                    status: 400,
                                    error: err
                                })
                                return
                            }
                            resolve({
                                documents: docs,
                                total: count,
                                pageSize: docs.length,
                                numberOfPages: Math.ceil(count / limit),
                                page
                            })

                            return
                        })
                return
            })

    })
}