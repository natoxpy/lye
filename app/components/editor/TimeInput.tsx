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
        <div className="relative flex h-full items-center text-[20px] text-txt-3">
            <input
                placeholder="00"
                className="flex selection:bg-unaccent-accent-1 w-7 h-7 text-center items-center outline-none border-none bg-transparent rounded placeholder:text-red-400 placeholder:opacity-50"
                ref={minuteRef}
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                onKeyDown={(e) => {
                    onkeydown(e)
                }}
                onInput={(e) => {
                    onInput(e)

                    if (e.currentTarget.value.length >= 2) {
                        secondRef.current?.focus()
                    }
                }}
            />
            <span className="text-unaccent-accent-1 opacity-40">:</span>
            <input
                placeholder="00"
                className="flex selection:bg-unaccent-accent-1 w-7 h-7 text-center items-center outline-none border-none bg-transparent rounded placeholder:text-red-400 placeholder:opacity-50"
                ref={secondRef}
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
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
