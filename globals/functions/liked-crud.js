import { LikesModel } from '../../models/index.js'

export const getLikedSongsByConditions = async (conditions) => {
    return new Promise((resolve) => {
        LikesModel.find(conditions, (err, docs) => {
            if (err) {
                resolve({
                    status: 400,
                    result: { message: "Error when getting liked songs!" }
                })
                return
            }
            console.log('likes its ok')
            resolve({
                status: 200,
                result: docs
            })
            return
        })
    })
}