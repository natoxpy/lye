import {
    KeyboardEvent,
    useEffect,
    ChangeEvent,
    RefObject,
    ClipboardEvent,
} from 'react'

export default function Component({
    header,
    content,
    inputRef,
    onChange,
    onKeyDown,
    onPaste,
}: {
    header: boolean
    content: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
    inputRef: RefObject<HTMLInputElement>
    onPaste: (e: ClipboardEvent<HTMLInputElement>) => void
}) {
    const computeWidth = (value: string, font: string): number => {
        const span = document.createElement('span')
        span.textContent = value

        // Apply styles to avoid affecting layout and match input font
        span.style.visibility = 'hidden'
        span.style.position = 'absolute'
        span.style.whiteSpace = 'pre' // ensures spaces are measured
        span.style.font = font // match font to input

        document.body.appendChild(span)
        const width = span.getBoundingClientRect().width
        document.body.removeChild(span)

        return width
    }

    useEffect(() => {
        const element = inputRef.current
        if (element == undefined) return

        const width = computeWidth(
            element.value,
            getComputedStyle(element).font
        )
        element.style.width = Math.max(width, 12) + 'px'
    }, [inputRef])

    return (
        <input
            onPaste={onPaste}
            ref={inputRef}
            value={content}
            onChange={(e) => onChange(e)}
            onKeyDown={(e) => onKeyDown(e)}
            style={{
                color: header ? 'var(--color-txt-3)' : 'var(--color-txt-2)',
            }}
            className="flex w-auto items-center h-full bg-transparent border-none outline-none"
            onInput={(e) => {
                const width = computeWidth(
                    e.currentTarget.value,
                    getComputedStyle(e.currentTarget).font
                )

                e.currentTarget.style.width = Math.max(width, 12) + 'px'
            }}
        />
    )
}
