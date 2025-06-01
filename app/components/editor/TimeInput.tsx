import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'

export default function Component({
    time,
    onChange,
}: {
    time?: number
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
    onChange: (t: number | undefined) => void
}) {
    const leadingZero = (t: number) => {
        if (Number.isNaN(t)) return ''
        return t >= 10 ? String(t) : '0' + t
    }
    const [minutes, setMinutes] = useState(
        leadingZero(Math.floor((time ?? NaN) / 60000) % 99)
    )
    const [seconds, setSeconds] = useState(
        leadingZero(Math.floor((time ?? NaN) / 1000) % 60)
    )

    const minuteRef = useRef<HTMLInputElement>(null)
    const secondRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!(minutes.length >= 2 && seconds.length >= 2))
            return onChange(undefined)

        const m = Number(minutes)
        const s = Number(seconds)

        const mMs = m * 60 * 1000
        const sMs = s * 1000

        onChange(mMs + sMs)
    }, [minutes, seconds, onChange])

    const onkeydown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (/[0-9]/.test(e.key) && e.currentTarget.value.length >= 2) {
            e.currentTarget.value = ''
        }
    }

    const onInput = (e: FormEvent<HTMLInputElement>) => {
        const element = e.currentTarget
        element.value = element.value.replace(/[^0-9]/g, '')
    }

    return (
        <div className="flex h-full items-center text-[20px] text-txt-3">
            <input
                ref={minuteRef}
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                onKeyDown={(e) => {
                    onkeydown(e)
                }}
                placeholder="00"
                className="flex w-7 h-7 text-center items-center outline-none border-none bg-transparent rounded placeholder:text-txt-3 placeholder:opacity-35"
                onInput={(e) => {
                    onInput(e)

                    if (e.currentTarget.value.length >= 2) {
                        secondRef.current?.focus()
                    }
                }}
            />
            <span className="text-txt-3 opacity-35">:</span>
            <input
                ref={secondRef}
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                placeholder="00"
                className="flex w-7 h-7 text-center items-center outline-none border-none bg-transparent rounded placeholder:text-txt-3 placeholder:opacity-35"
                onKeyDown={(e) => {
                    if (
                        e.key == 'Backspace' &&
                        e.currentTarget.value.length == 0
                    ) {
                        minuteRef.current?.focus()
                    }

                    onkeydown(e)
                }}
                onInput={(e) => {
                    onInput(e)

                    if (e.currentTarget.value.length >= 2) {
                        if (Number(e.currentTarget.value) > 60) {
                            e.currentTarget.value = '59'
                        }
                    }
                }}
            />
        </div>
    )
}
