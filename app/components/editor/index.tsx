import { useEffect, useState } from 'react'
import { LyricsSection, Line as StoreLine } from '@/states/store-lyrics'
import { Line } from './Line'
import Editor from './Editor'

function linetoStoreLine(line: Line): StoreLine {
    return { content: line.content, timerange: line.timerange, id: line.id }
}

function storeLineToLine(line: StoreLine, header: boolean): Line {
    return {
        content: line.content,
        timerange: line.timerange,
        id: line.id,
        header,
    }
}

export default function Component({
    lyricsSections,
    playerCurrentTime,
    onChange,
}: {
    lyricsSections: LyricsSection[]
    playerCurrentTime: number
    onChange: (lyrics: LyricsSection[]) => void
}) {
    const [lines, setLines] = useState<Array<Line>>([])

    useEffect(() => {
        const lns: Line[] = []

        for (const section of lyricsSections) {
            lns.push(storeLineToLine(section.header, true))
            lns.push(...section.content.map((l) => storeLineToLine(l, false)))
        }

        setLines(lns)
    }, [lyricsSections])

    useEffect(() => {
        const lyrics: LyricsSection[] = []
        let header: StoreLine | null = null
        let collect: Array<StoreLine> = []

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]

            if (line.header && header != null) {
                lyrics.push({
                    header,
                    content: collect,
                })
            }

            if (line.header) {
                header = linetoStoreLine(line)
                collect = []
                continue
            }

            collect.push(linetoStoreLine(line))
        }

        if (header != null)
            lyrics.push({
                header,
                content: collect,
            })

        if (lyrics.length == 0) return
        if (lyrics.length == lyricsSections.length) {
            let isSame = true
            for (let i = 0; i < lyrics.length; i++) {
                const l = lyrics[i]
                const ls = lyricsSections[i]
                if (JSON.stringify(l, null) != JSON.stringify(ls, null))
                    isSame = false
            }

            if (isSame) return
        }

        onChange(lyrics)
    }, [lines, onChange, lyricsSections])

    return (
        <div className="flex flex-col w-full h-full pt-3 overflow-y-auto overflow-x-hidden overscroll-none">
            <Editor
                playerCurrentTime={playerCurrentTime}
                lines={lines}
                setLines={(v) => setLines(v)}
            />
        </div>
    )
}
