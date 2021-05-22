import cron from 'node-cron'
import {
    UpdateOneSong,
    DeleteOneSong,
    getSongsByConditions,
    scrapTrackLinkHtml
} from './globals/functions/index.js'

export const ytUrlCron = () => {
    return cron.schedule('*/10 * * * *', async function () {
        const findResult = await getSongsByConditions(
            {
                youtubeUrl: '',
            },
            30,
            1
        )
        if (findResult.status >= 400) {
            return
        }
        let currentIndex = 0
        const songsLength = findResult.result.length

        const toUpdate = []
        const toDelete = []

        while (currentIndex < songsLength) {
            const song = findResult.result.documents[currentIndex]
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
    });
}