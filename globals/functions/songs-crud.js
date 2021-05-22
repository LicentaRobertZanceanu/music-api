import { SongsModel } from '../../models/index.js'

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

export const getSongById = (_id) => {
    return new Promise(async (resolve, reject) => {
        await SongsModel.findOne({ _id }, (err, doc) => {
            if (err) {
                resolve({
                    status: 404,
                    result: {
                        message: 'Song not found!',
                    }
                })
                return
            } else {
                resolve({
                    status: 200,
                    result: doc,
                })
                return
            }
        })
    })
}