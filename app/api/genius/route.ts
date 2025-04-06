import genius from 'genius-lyrics'
let Genius = genius
if (Genius == undefined)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Genius = require('genius-lyrics')

export async function GET(request: Request) {
    const client = new Genius.Client('')
    const url = new URL(request.url)
    const rawGeniusUrl = url.searchParams.get('url')
    if (rawGeniusUrl == undefined) return
    const geniusUrl = new URL(rawGeniusUrl)

    if (geniusUrl.origin !== 'https://genius.com')
        return Response.json({}, { status: 400 })

    const song = await client.songs.scrape(geniusUrl.href)

    let lyrics = song.lyrics().replaceAll(/\n\n/g, '\n')

    const headers = lyrics.matchAll(/\[.*\]/g)

    for (const header of Array.from(headers)) {
        const newHeader = header.toString().replaceAll(/[\[\]]/g, '')
        lyrics = lyrics.replace(header.toString(), '\u200B' + newHeader)
    }

    const album = String(
        song.data.songPage.trackingData.find((d) => d.key == 'Primary Album')
            ?.value
    )

    const artist = String(
        song.data.songPage.trackingData.find((d) => d.key == 'Primary Artist')
            ?.value
    )

    return Response.json({
        title: song.data.entities.songs[song.data.songPage.song].title,
        album,
        artist,
        lyrics: lyrics,
    })
}
