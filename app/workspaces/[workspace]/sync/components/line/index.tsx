import { formatMS } from '@/app/utils/time'

export default function Component({
    lineNumber,
    text,
    timeframe,
}: {
    text: string
    lineNumber: number
    timeframe?: [number, number]
}) {
    return (
        <div className="flex bg-bg-3 gap-[2px] min-w-[1000px] h-[46px] rounded-[4px] overflow-hidden">
            <div className="flex items-center justify-center bg-bg-5 min-w-[56px] h-full">
                <span className="text-txt-2">{lineNumber}</span>
            </div>
            <div className="flex items-center justify-center bg-bg-5 w-[112px] h-full">
                <span className="text-txt-2">{formatMS(timeframe?.[0])}</span>
            </div>
            <div className="bg-bg-5 px-[24px] flex w-full h-full items-center">
                <span className="text-txt-2">{text}</span>
            </div>
            <div className="flex items-center justify-center bg-bg-5 w-[112px] h-full">
                <span className="text-txt-2">{formatMS(timeframe?.[1])}</span>
            </div>
        </div>
    )
}
