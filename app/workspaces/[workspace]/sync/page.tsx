'use client'
import SyncLine from '@/app/components/sync-line'
import { useParams } from 'next/navigation'
import {
    useLineSync,
    useLyrics,
    useLyricsToolkit,
    useSynchronizer,
} from '@/states/hooks'

function Lines() {
    const { workspace } = useParams<{ workspace: string }>()
    const { findNearestNeighbors } = useLyricsToolkit(workspace)
    const lyricsWorkspaces = useLyrics((state) =>
        state.workspaces.find((v) => v.workspace == workspace)
    )

    const lineSyncWp = useLineSync((store) =>
        store.workspaces.find((w) => w.workspace == workspace)
    )
    const { lineSyncItems } = useLineSync((store) => store.actions)

    return (
        <>
            {lyricsWorkspaces?.lyrics.map((sections, i) => (
                <div className="h-fit flex flex-col gap-1" key={i}>
                    <div className="flex items-center justify-center rounded-md h-10 w-full">
                        <span
                            className="text-txt-3 text-[22px]"
                            id={sections.header.id}
                        >
                            {sections.header.content}
                        </span>
                    </div>

                    <div className="flex-col overflow-hidden rounded">
                        {sections.content.map((line, i) => (
                            <SyncLine
                                key={i}
                                content={line.content}
                                start={
                                    lineSyncWp?.content.find(
                                        (ls) => ls.targetId == line.id
                                    )?.timerange.start
                                }
                                end={
                                    lineSyncWp?.content.find(
                                        (ls) => ls.targetId == line.id
                                    )?.timerange.end
                                }
                                synced={
                                    lineSyncWp?.content.findIndex(
                                        (ls) => ls.targetId == line.id
                                    ) != -1
                                }
                                line={i + 1}
                                onClick={() => {
                                    const syncLine = lineSyncWp?.content.find(
                                        (l) => l.targetId == line.id
                                    )

                                    if (syncLine) {
                                        lineSyncItems.delete(
                                            workspace,
                                            syncLine.targetId
                                        )

                                        return
                                    }

                                    let duration =
                                        (sections.header.timerange?.end ?? 0) -
                                        (sections.header.timerange?.start ?? 0)

                                    if (duration <= 0) duration = 1000
                                    else duration /= sections.content.length

                                    let start =
                                        (sections.header.timerange?.start ??
                                            0) +
                                        duration * i

                                    let end = start + duration

                                    const { previous, next } =
                                        findNearestNeighbors(line.id)

                                    const objectPrevious =
                                        lineSyncWp?.content.find(
                                            (l) => l.targetId == previous?.id
                                        )

                                    const objectNext = lineSyncWp?.content.find(
                                        (l) => l.targetId == next?.id
                                    )

                                    const previousEnd =
                                        objectPrevious?.timerange.end

                                    const nextStart =
                                        objectNext?.timerange.start

                                    if (previousEnd && previousEnd > start) {
                                        start = previousEnd
                                    }

                                    if (nextStart && nextStart < end) {
                                        end = nextStart
                                    }

                                    lineSyncItems.add(workspace, {
                                        targetId: line.id,
                                        timerange: {
                                            start: start,
                                            end: end,
                                        },
                                    })
                                }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </>
    )
}

function SideHeaderNavigation() {
    const { workspace } = useParams<{ workspace: string }>()
    const lyricsWorkspaces = useLyrics((state) =>
        state.workspaces.find((v) => v.workspace == workspace)
    )

    const { setMaxwidth, setOffset, frame, duration } = useSynchronizer(
        (state) => state
    )

    return (
        <div className="flex flex-col pt-[20px]">
            {lyricsWorkspaces?.lyrics.map((section, i) => (
                <a
                    href={'#' + section.header.id}
                    className="flex justify-end px-3 py-2 rounded group cursor-pointer"
                    key={i}
                    onClick={() => {
                        const start = section.header.timerange?.start
                        const end = section.header.timerange?.end

                        if (start == undefined || end == undefined) return

                        const timerange = end - start

                        const mw = (frame * duration) / timerange
                        setMaxwidth(mw)
                        setOffset(start)
                    }}
                >
                    <span className="text-[16px] text-txt-3 group-hover:text-txt-2">
                        {section.header.content}
                    </span>
                </a>
            ))}
        </div>
    )
}

export default function Page() {
    return (
        <div className="h-full flex flex-row gap-8 overflow-hidden">
            <div className="flex flex-col items-end w-64 mt-4">
                <SideHeaderNavigation />
            </div>
            <div className="h-full scroll-smooth overflow-auto pt-4 pb-[230px] no-scrollbar flex flex-col gap-4">
                <Lines />
            </div>
            <div className="w-64"></div>
        </div>
    )
}
