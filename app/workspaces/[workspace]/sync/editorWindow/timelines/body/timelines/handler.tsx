import { useEffect } from 'react'
import { useLocalState } from '../state'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setStartMs } from '@/store/stores/synclines'
import { usePlayerState } from '@/app/player/state'
import { Line, setTimeline } from '@/store/stores/synclines/reducer'

// Virtual Realm
class VR {
    result: number
    constructor(
        public location: number,
        public cursor: number,
        public levelTarget: 'primary' | 'secondary',
        public duration: number,
        public line: Line,
        public lines: Line[]
    ) {
        this.result = this.location
    }

    public utilOverlap(lhs: Line, rhs: Line) {
        const A = lhs.startMs
        const B = A + lhs.durationMs

        const C = rhs.startMs
        const D = C + rhs.durationMs

        return B > C && A < D
    }

    public utilLineSpan(line: Line): [number, number] {
        return [line.startMs, line.startMs + line.durationMs]
    }

    public utilLinesSpan(lines: Line[]): Array<[number, number]> {
        const spans = []

        for (const line of lines) {
            spans.push(this.utilLineSpan(line))
        }

        return spans
    }

    public utilJoinSpans(spans: Array<[number, number]>): [number, number] {
        let leftest = Infinity
        let rightest = 0

        for (const span of spans) {
            if (span[0] < leftest) leftest = span[0]
            if (span[1] > rightest) rightest = span[1]
        }

        return [leftest, rightest]
    }

    public utilCollapseDirection(
        location: number,
        span: [number, number]
    ): 'left' | 'right' {
        const spanDuration = span[1] - span[0]
        const midPoint = span[0] + spanDuration / 2

        return location > midPoint ? 'right' : 'left'
    }

    public utilCollapseToEdge(
        line: Line,
        location: number,
        span: [number, number]
    ) {
        const direction = this.utilCollapseDirection(location, span)
        const left = span[0] - line.durationMs
        const right = span[1]

        if (direction == 'left') {
            if (left >= 0) return left
            else return right
        } else {
            if (right + line.durationMs >= this.duration) return left
            else return right
        }
    }

    public getLine(): Line {
        return { ...this.line, startMs: this.location }
    }

    public utilFindOverlappingLine(target: Line, lines: Line[]): Line | void {
        for (const line of lines) {
            if (line.lineNumber === target.lineNumber) continue
            if (this.utilOverlap(target, line)) return line
        }
    }

    /**
     *
     * @param overlap Last overlaping line
     * @param registry Set of all overlaping lines on record
     * @returns
     */
    public utilCollapseOverrun(
        cursor: number,
        target: Line,
        lines: Line[],
        overlap: Line,
        registry: Set<Line> = new Set()
    ): number {
        const nextStep = this.utilCollapseToEdge(
            target,
            cursor,
            this.utilJoinSpans(
                this.utilLinesSpan(
                    Array.from(new Set([overlap, ...Array.from(registry)]))
                )
            )
        )

        const shadowLine = { ...target, startMs: nextStep }

        const shadowOverlap = this.utilFindOverlappingLine(shadowLine, lines)

        if (shadowOverlap == undefined) {
            return nextStep
        }
        return this.utilCollapseOverrun(
            cursor,
            target,
            lines,
            shadowOverlap,
            registry.add(overlap)
        )
    }

    public collision() {
        const lines = this.lines.filter(
            (item) => item.timeline === this.levelTarget
        )
        const overlapLine = this.utilFindOverlappingLine(this.getLine(), lines)
        if (!overlapLine) return

        this.result = this.utilCollapseOverrun(
            this.cursor,
            this.getLine(),
            lines,
            overlapLine
        )
    }

    compute() {
        this.collision()
        return this.result
    }
}

export default function Handler() {
    const leftOffset = 96
    const {
        visibleMarks,
        canvasWidthPx,
        timeWidth,
        timeOffset,
        targetItem,
        targetOffsetPx,
        locationTarget,
        levelTarget,
        setTargetItem,
        setLocationTarget,
        setCursorLocation,
        setLevelTarget,
    } = useLocalState()
    const { duration } = usePlayerState()
    const lines = useAppSelector((state) => state.syncLines.lines)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const mousemove = (e: MouseEvent) => {
            if (targetItem == null || targetOffsetPx == null) return

            computeLevel(e.clientY)

            const process = (v: number) => {
                if (v < 0) v = 0
                if (canvasWidthPx < v) v = canvasWidthPx
                return Math.floor((v / canvasWidthPx) * timeWidth)
            }

            const x = e.clientX - leftOffset - targetOffsetPx
            const cursor = e.clientX - leftOffset

            moveElement(process(x), process(cursor))
        }

        const computeLevel = (y: number) => {
            const offset = 96
            const docHeight = document.body.getBoundingClientRect().height

            if (docHeight - offset > y) {
                setLevelTarget('primary')
            } else {
                setLevelTarget('secondary')
            }
        }

        const moveElement = (time: number, cursor: number) => {
            const clamp = (v: number) => {
                if (targetItem == null) return
                const items = visibleMarks.map((item, id) => [
                    Math.abs(v - item),
                    id,
                ])

                items.sort((a, b) => a[0] - b[0])

                return timeOffset + visibleMarks[items[0][1]]
            }

            let lineTime = clamp(time)
            const cursorTime = clamp(cursor)
            if (
                lineTime == undefined ||
                cursorTime == undefined ||
                levelTarget == null
            )
                return

            const line = lines.find((item) => item.lineNumber === targetItem)
            if (!line) return

            const lineDuration = line.durationMs

            if (lineTime + lineDuration >= duration)
                lineTime = duration - lineDuration

            const vr = new VR(
                lineTime,
                cursorTime,
                levelTarget,
                duration,
                line,
                lines
            )
            const vrComputed = vr.compute()

            if (vrComputed !== lineTime) {
                setCursorLocation(lineTime)
            } else setCursorLocation(null)

            setLocationTarget(vrComputed)
        }

        const mouseup = () => {
            setTargetItem(null)
            setLocationTarget(null)

            if (
                targetItem == null ||
                locationTarget == null ||
                levelTarget == null
            )
                return

            dispatch(
                setTimeline({
                    lineNumber: targetItem,
                    value: levelTarget,
                })
            )

            dispatch(
                setStartMs({
                    lineNumber: targetItem,
                    value: locationTarget,
                })
            )
        }

        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)

        return () => {
            document.removeEventListener('mousemove', mousemove)
            document.removeEventListener('mouseup', mouseup)
        }
    })

    return <></>
}
