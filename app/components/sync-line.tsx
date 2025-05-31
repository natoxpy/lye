import { formatMS } from '@/utils/time'

export default function Component({
    content,
    line,
    start,
    time,
    end,
    synced,
    onClick,
}: {
    content: string
    line: number
    synced: boolean
    time: number
    start?: number
    end?: number
    onClick: () => void
}) {
    const bg = synced ? 'var(--color-bg-4)' : 'var(--color-bg-2)'

    return (
        <div
            style={{
                color: synced ? 'var(--color-txt-2)' : '',
                cursor: !synced ? 'pointer' : '',
            }}
            className="flex text-txt-3 hover:text-txt-2 bg-bg-3 text-[1rem] select-none gap-[3px] hover:border-accent-blue border-bg-3 cursor-pointer transition-all cursor border-x-2 min-w-[1000px] h-[46px] overflow-hidden"
            onClick={onClick}
        >
            <div
                style={{
                    background:
                        start != undefined &&
                        end != undefined &&
                        time >= start &&
                        time <= end
                            ? 'var(--color-bg-6)'
                            : bg,
                }}
                className="flex relative items-center justify-center min-w-[56px] h-full"
            >
                <span className="z-10">{line}</span>
                <div className="absolute left-0 top-0 w-full h-full">
                    {start != undefined &&
                    end != undefined &&
                    time > start &&
                    time < end ? (
                        <div
                            style={{
                                height:
                                    (1 - (end - time) / (end - start)) * 100 +
                                    '%',
                            }}
                            className="absolute left-0 top-0 w-full bg-accent-blue"
                        ></div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div
                style={{
                    background: bg,
                }}
                className="flex relative items-center justify-center min-w-[112px] h-full"
            >
                <span>{formatMS(start)}</span>
            </div>
            <div
                style={{
                    background: bg,
                }}
                className="relative overflow-hidden px-[24px] flex w-full h-full items-center"
            >
                <span>{content}</span>
            </div>
            <div
                style={{
                    background: bg,
                }}
                className="flex items-center justify-center  min-w-[112px] h-full"
            >
                <span>{formatMS(end)}</span>
            </div>
        </div>
    )
}
