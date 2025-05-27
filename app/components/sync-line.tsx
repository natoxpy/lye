import { formatMS } from '@/utils/time'

function DoubleSidedIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            width="10"
            height="46"
            viewBox="0 0 10 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M2 1H5H8V3.2L5 5.4V40.6L8 42.8V45H5H2V42.8L5 40.6V5.4L2 3.2V1Z" />
            <path
                d="M5 5.4L2 3.2V1H5H8V3.2L5 5.4ZM5 5.4V40.6M5 40.6L2 42.8V45H5H8V42.8L5 40.6Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

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
                {/*}
                {start != undefined &&
                end != undefined &&
                time >= start &&
                time <= end ? (
                    <DoubleSidedIcon
                        style={{
                            left:
                                (1 - (end - time) / (end - start)) * 100 + '%',
                        }}
                        className="absolute stroke-accent-1 fill-accent-1"
                    />
                ) : (
                    <></>
                )}
                {*/}

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
