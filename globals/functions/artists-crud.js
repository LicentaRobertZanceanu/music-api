import { ArtistsModel } from '../../models/index.js'

export const getArtistsByConditions = (conditions, limit, page) => {
    return new Promise(async (resolve) => {
        ArtistsModel
            .find(conditions)
            .limit(limit)
            .skip((limit * page) - limit)
            .exec((err, docs) => {
                if (err) {
                    resolve({
                        status: 404,
                        result: {
                            message: "No artists were found!"
                        }
                    })
                    return
                }
                ArtistsModel.countDocuments(conditions, (countErr, count) => {
                    if(countErr) {
                        resolve({
                            status: 404,
                            result: {
                                message: "Count error!"
                            }
                        })
                        return
                    }
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
                })
                return
            })
    })
}

export const getArtistById = (_id) => {
    return new Promise(async (resolve) => {
        ArtistsModel
            .findOne({ _id }, (err, doc) => {
                if (err) {
                    resolve({
                        status: 404,
                        result: {
                            message: "No artists were found!"
                        }
                    })
                    return
                }
                resolve({
                    status: 200,
                    result: doc
                })
                return
            })
    })
}