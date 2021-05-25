import { callApi, getGenresByConditions, InsertArtists, InsertSongs, scrapTrackLinkHtml } from "../../globals/functions/index.js"

const getTrackData = async ({ lastfmId, trackName, trackArtist }) => {
    let uri = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${process.env.LAST_FM_API_KEY}&track=believe&format=json`
    if (lastfmId) {
        uri = `${uri}&mbid=${lastfmId}`
    } else {
        uri = `${uri}&artist=${trackArtist}&track=${trackName}`
    }

    uri = encodeURI(uri)

    return await new Promise(async (resolve) => {
        const response = await callApi({ uri })
        if (!response) {
            resolve(null)
            return
        }

        const responseTrack = response.track

        if (!responseTrack) {
            resolve(null)
            return
        }

        if (!responseTrack.url) {
            resolve(null)
            return
        }

        if (!responseTrack.name) {
            resolve(null)
            return
        }

        const track = {
            name: responseTrack.name || '',
            lastFmId: responseTrack.mbid || `${trackName}-${trackArtist}`,
            lastFmUrl: responseTrack.url,
            artistLastFmUrl: responseTrack.artist.mbid,
            youtubeUrl: ''
        }

        if (responseTrack.album) {
            if (responseTrack.album.image.length > 0) {
                const foundExtralargeImageIndex = responseTrack.album.image.findIndex(image => image.size === 'extralarge')
                if (foundExtralargeImageIndex > -1) {
                    track.image = responseTrack.album.image[foundExtralargeImageIndex]['#text']
                } else {
                    track.image = responseTrack.album.image[0]['#text']
                }
            }
        }

        resolve(track)
        return
    })
}

const getLastFmDataByGenre = async (genre, addToList) => {
    let page = 1
    let numberOfPages = 10

    const tracks = []
    const artists = []
    return await new Promise(async (resolve) => {
        while (page < numberOfPages) {
            const requestOptions = {
                uri: `http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${genre.lastFmTag}&api_key=${process.env.LAST_FM_API_KEY}&format=json&page=${page}`
            }

            const response = await callApi(requestOptions)
            if (!response) {
                page += 1
                continue
            }

            if (page === 1) {
                const maxNumberForThisRequest = parseInt(response.tracks['@attr'].totalPages)
                if (numberOfPages > maxNumberForThisRequest) {
                    numberOfPages = maxNumberForThisRequest
                }
            }

            const tracksFromResponse = response.tracks.track
            let currentIndex = 0
            const numberOfTracks = tracksFromResponse.length

            while (currentIndex < numberOfTracks) {
                const track = tracksFromResponse[currentIndex]

                if (!track.artist || !track.name) {
                    currentIndex += 1
                    continue
                }

                const trackInfo = await getTrackData({
                    lastfmId: track.mbid,
                    trackName: track.name,
                    trackArtist: track.artist.name
                })

                if (!trackInfo) {
                    currentIndex += 1
                    continue
                }

                trackInfo.genre = genre

                artists.push({
                    name: track.artist.name,
                    lastFmId: track.artist.mbid || `${track.artist.name}`
                })
                tracks.push(trackInfo)

                currentIndex += 1
            }

            page += 1
        }

        resolve(addToList({
            tracks,
            artists
        }))
        return
    })
}

export const getSongs = async (req, res) => {
    await getGenresByConditions()
        .then(genresResponse => {
            // res.status(202).json(genres.result)
            return genresResponse.result
        })
        .then(async genres => {
            const uniqueMusicResponse = {
                artists: [],
                artistNames: new Map(),
                tracks: [],
                trackNames: new Map()
            }

            const addToUniqueElementLists = ({ artists, tracks }) => {
                artists.map((artist) => {
                    if (!uniqueMusicResponse.artistNames.has(artist.lastFmId)) {
                        uniqueMusicResponse.artists.push(artist)
                        uniqueMusicResponse.artistNames.set(artist.lastFmId, true)
                    }
                })

                tracks.map((track) => {
                    if (!uniqueMusicResponse.trackNames.has(track.lastFmId)) {
                        uniqueMusicResponse.tracks.push(track)
                        uniqueMusicResponse.trackNames.set(track.lastFmId, true)
                    }
                })
            }

            let currentIndex = 0
            const numberOfGenres = genres.length
            while (currentIndex < numberOfGenres) {
                const genre = genres[currentIndex]
                await getLastFmDataByGenre(genre, addToUniqueElementLists)
                currentIndex += 1
            }

            return ({ artists: uniqueMusicResponse.artists, tracks: uniqueMusicResponse.tracks })
        })
        .then(async elements => {
            const insertArtistsResponse = await InsertArtists(elements.artists)
            if (insertArtistsResponse.status !== 200) {
                res
                    .status(insertArtistsResponse.status)
                    .json({ message: insertArtistsResponse.message })
                return
            }

            const songsToInsert = []
            elements.tracks.map((song) => {
                if (song.lastFmId) {
                    const foundArtist = insertArtistsResponse.insertedArtists.find(artist => artist.lastFmId === song.artistLastFmUrl)
                    songsToInsert.push({
                        ...song,
                        artist: foundArtist
                    })
                }
            })
            console.log('ir', songsToInsert)

            const insertedSongs = await InsertSongs(songsToInsert)
            console.log('weg', insertedSongs)
            if (insertedSongs.status !== 200) {
                res
                    .status(insertedSongs.status)
                    .json({ message: insertedSongs.message })
                return
            }

            res.json(elements)
            // return
        })
        .catch(genresError => {
            console.log('getgenreseRROR', genresError)
            res.status(genresError.status).json(genresError.message)
            // return
        })
    return
}