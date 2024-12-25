'use client'
import { usePlainLyricsWorkspace } from '@/states/plain-lyrics'
import SyncLine from '@/app/components/sync-line'
import { useParams } from 'next/navigation'
import { Milliseconds, UNAME } from '@/utils/units'

export default function Page() {
    const { workspace } = useParams<{ workspace: UNAME }>()
    const lines = usePlainLyricsWorkspace(workspace)

    return (
        <div className="h-fit flex flex-col gap-4">
            {lines.map((ln, key) => (
                <SyncLine
                    key={key}
                    content={ln}
                    start={100 as Milliseconds}
                    end={10000 as Milliseconds}
                    inTimeLine={true}
                    left={-100}
                    line={1}
                    onClick={() => {}}
                />
            ))}
        </div>
    )
}
