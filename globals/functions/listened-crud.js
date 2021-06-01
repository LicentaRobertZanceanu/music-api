import {ListenedModel} from '../../models/index.js'

export const getListenedSongsByConditions = (conditions) => {
    return new Promise((resolve) => {
        ListenedModel.find(conditions, (err, docs) => {
            if (err) {
                resolve({
                    status: 400,
                    result: { message: "Error when getting listened songs!" }
                })
                return
            }
            console.log('listened its ok')
            resolve({
                status: 200,
                result: docs
            })
            return
        })
    })
}