'use client'
import Dropdown from '@/app/components/header-dropdown'
import Header from '@/app/components/workspaces-header'
import {
    useHeader,
    useLineSync,
    useLyrics,
    useWorkspaces,
} from '@/states/hooks'
import { formatMS } from '@/utils/time'
import { useParams } from 'next/navigation'
import { useCallback } from 'react'

export default function Page() {
    const {
        tab,
        active,
        actions: { setActive, setTab },
    } = useHeader((state) => state)
    const { workspace } = useParams<{ workspace: string }>()

    const wp = useWorkspaces((state) =>
        state.workspaces.find((w) => w.shorthand_id == workspace)
    )

    const linesyncwp = useLineSync((state) =>
        state.workspaces.find((w) => w.workspace == workspace)
    )

    const lyricswp = useLyrics((state) =>
        state.workspaces.find((w) => w.workspace == workspace)
    )

    const dldLRCFile = useCallback(() => {
        const syncedlines = linesyncwp?.content
        const lyrics = lyricswp?.lyrics

        if (syncedlines == undefined || lyrics == undefined) return

        const getSynced = (targetId: string) =>
            syncedlines.find((s) => s.targetId == targetId)

        const track = []

        for (let i = 0; i < lyrics.length; i++) {
            const section = lyrics[i]
            for (let y = 0; y < section.content.length; y++) {
                const line = section.content[y]
                track.push({ sync: getSynced(line.id), line })
            }
        }

        let str = ''

        if (wp?.title) str += `[ti:${wp.title}]\n`
        if (wp?.meta.artist) str += `[al:${wp.meta.artist}]\n`
        if (wp?.meta.album) str += `[au:${wp.meta.album}]\n`

        str += `[tool:lye]\n\n`

        for (let i = 0; i < track.length; i++) {
            const previous = track[i - 1]
            const line = track[i]

            const previousEnd = previous?.sync?.timerange.end
            const start = line.sync?.timerange.start

            if ((previousEnd == undefined && i != 0) || start == undefined)
                return

            if (start - previousEnd! > 250 && i != 0)
                str += `[${formatMS(previousEnd)}]\n`

            str += `[${formatMS(start)}]${line.line.content}\n`
        }

        const a = document.createElement('a')

        a.setAttribute(
            'href',
            `data:text/plain;charset=utf-8,${encodeURIComponent(str)}`
        )
        a.setAttribute(
            'download',
            (wp?.title.replace(/ /g, '-') ?? 'Lyrics') + '.lrc'
        )

        a.style.display = 'none'
        document.body.appendChild(a)

        a.click()

        document.body.removeChild(a)
    }, [lyricswp, linesyncwp, wp])

    return (
        <Header
            dropdown={
                <Dropdown
                    actions={{
                        downloadLRCFile: dldLRCFile,
                    }}
                    tab={[tab, setTab]}
                    active={[active, setActive]}
                />
            }
            onClick={() => setActive(!active)}
            active={[active, setActive]}
        />
    )
}
