import { GenresModel } from '../../models/index.js'

export const getGenresByConditions = async (conditions = {}) => {
    return new Promise(async (resolve, reject) => {
        await GenresModel.find(conditions, (err, docs) => {
            if (err) {
                reject({
                    status: 404,
                    result: {
                        message: 'Error!',
                    }
                })
                return
            } else {
                resolve({
                    status: 200,
                    result: docs,
                })
                return
            }
        })
    })
}