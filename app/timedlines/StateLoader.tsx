import * as LyricsActions from '@/lib/lyrics'
import * as TimedlinesActions from '@/lib/timedlines'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useEffect } from 'react'
import { Session } from '../cachedb/sessions'
import { useCacheDispatch } from './localState'

export default function Loader() {
    const activeSession = useAppSelector((state) => state.sessions.activeSession)
    const cacheDispatch = useCacheDispatch()
    const everyLyrics = useAppSelector((state) => state.lyrics.lyrics)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (activeSession == null) return

        const asyncFun = async () => {
            cacheDispatch({
                type: 'session/update',
                payload: await Session.get(activeSession.uuid)
            })
        }

        asyncFun()
    }, [activeSession])

    useEffect(() => {
        if (everyLyrics == null) return
        const lyric = everyLyrics.find((i) => i.uuid == activeSession?.lyricRef)
        if (!lyric) return

        const data = lyric.lines.map((i) => i['content'])
        let ndata = data.map((item, i) => [i + 1, item]) as Array<[number, string]>
        ndata = ndata.filter((item) => !item[1].startsWith('['))
        ndata = ndata.filter((item) => !(item[1].trim() === ''))

        dispatch(LyricsActions.setActive(ndata))

        const asyncFun = async () => {
            if (activeSession === null) return

            const session = await Session.get(activeSession.uuid)
            const timedlines = session.timedlines.serialize().timelines

            dispatch(TimedlinesActions.loadAll(timedlines))
        }

        asyncFun()
    }, [everyLyrics, activeSession, dispatch])

    return <></>
}
