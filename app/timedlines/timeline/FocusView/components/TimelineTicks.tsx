import { formattedMS } from '../../../page'

export default function Component({
    duration,
    divwidth,
    detailTime
}: {
    duration: number
    divwidth: number
    detailTime: number
}) {
    const details = Math.floor(duration / detailTime)

    return (
        <div className="relative flex w-full">
            {Array.from({
                length: details
            }).map((_, i) => (
                <div key={i}>
                    {i % 16 == 0 ? (
                        <div
                            className="flex justify-center absolute min-w-[2px] h-0 bg-text-400 opacity-55"
                            style={{
                                left: (1 + i) * (divwidth / details) - 0.5 + 'px'
                            }}
                        >
                            <div className="absolute min-w-[2px] h-1 bg-text-400 z-50 opacity-95"></div>
                            <div className="-top-0.5 absolute min-w-[2px] h-2  z-50 ">
                                <span className="text-xs text-text-400 select-none">
                                    {formattedMS((1 + i) * detailTime)}
                                </span>
                            </div>
                            <div className="absolute min-w-[1px] h-28 bg-text-800 opacity-55"></div>
                        </div>
                    ) : i % 2 !== 0 ? (
                        <div
                            className="absolute flex min-w-[2px] h-0 opacity-40"
                            style={{
                                left: (1 + i) * (divwidth / details) - 0.5 + 'px'
                            }}
                        >
                            <div className="absolute min-w-[2px] h-2 bg-text-700 opacity-20"></div>
                        </div>
                    ) : (
                        <div
                            className="absolute flex min-w-[2px] h-0 opacity-40"
                            style={{
                                left: (1 + i) * (divwidth / details) - 0.5 + 'px'
                            }}
                        >
                            <div className="absolute min-w-[2px] h-3 bg-text-800 z-50"></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
