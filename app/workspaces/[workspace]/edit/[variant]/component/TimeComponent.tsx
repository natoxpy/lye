import { Milliseconds } from '@/app/utils/units'

export default function TimeComponent({
    ms,
    includeMs,
}: {
    ms: Milliseconds
    includeMs?: boolean
}) {
    const format = (ms: Milliseconds) => {
        const ps = Math.floor(ms / 10) % 100
        const s = Math.floor(ms / 1000) % 60
        const m = Math.floor(ms / 1000 / 60)

        const psf = ps >= 10 ? `${ps}` : `0${ps}`
        const ss = s >= 10 ? `${s}` : `0${s}`
        const mm = m >= 10 ? `${m}` : `0${m}`

        if (includeMs) return `${mm}:${ss}.${psf}`
        else return `${mm}:${ss}`
    }

    return (
        <div
            style={{
                minWidth: includeMs ? '80px' : '60px',
            }}
            className="flex items-center justify-center h-full"
        >
            <span className="text-txt-1 text-[12px] select-none">
                {format(ms)}
            </span>
        </div>
    )
}
