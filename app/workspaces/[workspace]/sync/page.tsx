'use client'
import { usePlainLyricsLinesWorkspace } from '@/states/store-plain-lyrics'
import SyncLine from '@/app/components/sync-line'
import { useParams } from 'next/navigation'
import { UNAME } from '@/utils/units'

function Lines() {
    const { workspace } = useParams<{ workspace: UNAME }>()
    const lines = usePlainLyricsLinesWorkspace(workspace)

    return (
        <>
            {lines.map((content, key) => (
                <SyncLine
                    key={key}
                    content={content}
                    inTimeLine={true}
                    left={-100}
                    line={key + 1}
                    onClick={() => {}}
                />
            ))}
        </>
    )
}

export default function Page() {
    return (
        <div className="h-fit flex flex-col gap-4">
            <Lines />
        </div>
    )
}
