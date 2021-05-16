import {
    UpdateOneSong,
    DeleteOneSong,
    getSongsByConditions,
    scrapTrackLinkHtml
} from '../../globals/functions/index.js'

export const getSongsWithoutYtUrl = async (req, res) => {
    const findResult = await getSongsByConditions(
        {
            youtubeUrl: '',
        },
        30,
        1
    )
    if (findResult.status >= 400) {
        res.status(findResult.status).json({ message: findResult.result })
        return
    }

    let currentIndex = 0
    const songsLength = findResult.result.length

    const toUpdate = []
    const toDelete = []

    while (currentIndex < songsLength) {
        const song = findResult.result[currentIndex]
        const youtubeUrl = await scrapTrackLinkHtml(song.lastFmUrl)
        if (!youtubeUrl) {
            toDelete.push(song)
            currentIndex += 1
            continue
        }
        song.youtubeUrl = youtubeUrl
        toUpdate.push(song)
        currentIndex += 1
    }

    await Promise.all(toUpdate.map(async song => {
        await UpdateOneSong({ _id: song._id }, { youtubeUrl: song.youtubeUrl })
    }))

    await Promise.all(toDelete.map(async song => {
        await DeleteOneSong(song)
    }))

    console.log({
        toDelete,
        toUpdate
    })

    res.status(202).json({
        toDelete,
        toUpdate
    })
}