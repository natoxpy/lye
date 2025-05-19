'use client'

import { useLineSync, useLyrics, useSynchronizer } from '@/states/hooks'
import { useParams } from 'next/navigation'

function Component({
    content,
    duration,
    start,
}: {
    duration: number
    start: number
    content: string
}) {
    const {
        offsetPx,
        duration: TotalDuration,
        maxwidth,
    } = useSynchronizer((state) => state)

    const startOffset = (start / TotalDuration) * maxwidth

    return (
        <div
            style={{
                width: `${(duration / TotalDuration) * maxwidth}px`,
                left: `${startOffset - offsetPx}px`,
            }}
            className="flex text-sm items-center justify-center absolute rounded-sm h-16 bg-unaccent-accent-1 hover:border-accent-1 border-bg-2 border-[1px] cursor-pointer text-txt-2"
        >
            {content}
        </div>
    )
}

export default function Page() {
    const { workspace } = useParams<{ workspace: string }>()
    const lyrics = useLyrics((state) =>
        state.workspaces.find((w) => w.workspace == workspace)
    )
    const wp = useLineSync((state) =>
        state.workspaces.find((w) => w.workspace == workspace)
    )

    return (
        <>
            {wp?.content.map((v, i) => {
                const section = lyrics?.lyrics
                    .map((item) =>
                        item.content.find((initem) => initem.id == v.targetId)
                    )
                    .filter((v) => v != undefined)[0]

                if (section == undefined) {
                    // Likely Error
                    //
                    // Lyrics Line was removed but it's linesync
                    // line which uses it was not cleaned
                    console.error('section should not be undefined')
                    return <></>
                }

                return (
                    <Component
                        duration={v.timerange.duration}
                        start={v.timerange.start}
                        content={section.content}
                        key={i}
                    />
                )
            })}
        </>
    )
}
