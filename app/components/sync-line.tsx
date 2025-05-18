import { formatMS } from '@/utils/time'
import { Milliseconds } from '@/utils/units'

// function DoubleSidedIcon(props: React.ComponentProps<'svg'>) {
//     return (
//         <svg
//             width="10"
//             height="46"
//             viewBox="0 0 10 46"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             {...props}
//         >
//             <path d="M2 1H5H8V3.2L5 5.4V40.6L8 42.8V45H5H2V42.8L5 40.6V5.4L2 3.2V1Z" />
//             <path
//                 d="M5 5.4L2 3.2V1H5H8V3.2L5 5.4ZM5 5.4V40.6M5 40.6L2 42.8V45H5H8V42.8L5 40.6Z"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//             />
//         </svg>
//     )
// }

export default function Component({
    content,
    line,
    start,
    end,
    synced,
    onClick,
}: {
    content: string
    line: number
    synced: boolean
    start?: Milliseconds
    end?: Milliseconds
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
                    background: bg,
                }}
                className="flex items-center justify-center min-w-[56px] h-full"
            >
                <span>{line}</span>
            </div>
            <div
                style={{
                    background: bg,
                }}
                className="flex items-center justify-center min-w-[112px] h-full"
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
