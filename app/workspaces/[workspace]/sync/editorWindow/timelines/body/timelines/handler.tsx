import { useEffect } from 'react'
import { useLocalState } from '../state'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setStartMs } from '@/store/stores/synclines'
import { usePlayerState } from '@/app/player/state'
import {
    Line,
    setDurationMs,
    setTimeline,
} from '@/store/stores/synclines/reducer'

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

    public getLines() {
        const lines = this.lines.filter((i) => i.timeline == this.levelTarget)

        if (
            lines.findIndex((i) => i.lineNumber === this.line.lineNumber) === -1
        ) {
            lines.push({ ...this.line, timeline: this.levelTarget })
        }

        lines.sort((a, b) => a.lineNumber - b.lineNumber)

        return lines
    }

    moveCompute() {
        const lines = this.getLines()

        const currentIndex = lines.findIndex(
            (i) => i.lineNumber == this.line.lineNumber
        )

        if (currentIndex == -1) return this.result

        const left = lines[currentIndex - 1]
        const right = lines[currentIndex + 1]

        const leftLimit = left ? left.startMs + left.durationMs : 0
        const rightLimit =
            (right ? right.startMs : this.duration) - this.line.durationMs

        if (this.location <= leftLimit) this.result = leftLimit
        else if (this.location >= rightLimit) this.result = rightLimit

        if (
            rightLimit + this.line.durationMs - leftLimit >=
            this.line.durationMs
        )
            return this.result

        return null
    }

    leftCompute() {
        const lines = this.getLines()

        const currentIndex = lines.findIndex(
            (i) => i.lineNumber == this.line.lineNumber
        )

        if (currentIndex == -1) return this.result

        const left = lines[currentIndex - 1]

        const leftLimit = left ? left.startMs + left.durationMs : 0

        if (this.location <= leftLimit) this.result = leftLimit

        return this.result
    }

    rightCompute() {
        const lines = this.getLines()

        const currentIndex = lines.findIndex(
            (i) => i.lineNumber == this.line.lineNumber
        )

        if (currentIndex == -1) return this.result

        const right = lines[currentIndex + 1]

        const rightLimit = right ? right.startMs : this.duration

        if (this.location >= rightLimit) this.result = rightLimit

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
        cursorLevelTarget,
        levelTarget,
        resizeType,
        setTargetOffsetPx,
        setTargetItem,
        setLocationTarget,
        setCursorLocation,
        setLevelTarget,
        setCursorLevelTarget,
        setResizeType,
    } = useLocalState()
    const { duration } = usePlayerState()
    const lines = useAppSelector((state) => state.syncLines.lines)
    const dispatch = useAppDispatch()
    const clamp = (v: number) => {
        if (targetItem == null) return
        const items = visibleMarks.map((item, id) => [Math.abs(v - item), id])

        items.sort((a, b) => a[0] - b[0])

        return timeOffset + visibleMarks[items[0][1]]
    }

    useEffect(() => {
        const mousemove = (e: MouseEvent) => {
            if (targetItem == null || targetOffsetPx == null) return

            const process = (v: number) => {
                if (v < 0) v = 0
                if (canvasWidthPx < v) v = canvasWidthPx
                return Math.floor((v / canvasWidthPx) * timeWidth)
            }

            const x = e.clientX - leftOffset - targetOffsetPx
            const cursor = e.clientX - leftOffset

            computeCursorLevel(e.clientY)

            if (resizeType !== null) {
                if (resizeType == 'right') {
                    const v = clamp(process(cursor))
                    if (v !== undefined) resizeRight(v)
                } else {
                    const v = clamp(process(cursor))
                    if (v !== undefined) resizeLeft(v)
                }
                return
            }

            const levelCompute = moveElement(process(x), process(cursor))
            if (levelCompute !== null) computeLevel(e.clientY)
        }

        const resizeRight = (time: number) => {
            const line = lines.find((item) => item.lineNumber === targetItem)
            if (!line || targetItem == undefined) return

            const clampedTime = clamp(time)
            if (clampedTime == null) return

            const min = 1000

            const vr = new VR(
                clampedTime,
                clampedTime,
                line.timeline,
                duration,
                line,
                lines
            )

            const computed = vr.rightCompute()

            let val = computed - line.startMs
            if (val <= min) val = min

            dispatch(
                setDurationMs({
                    lineNumber: targetItem,
                    value: val,
                })
            )
        }

        const resizeLeft = (time: number) => {
            const line = lines.find((item) => item.lineNumber === targetItem)
            if (!line || targetItem == undefined) return

            const clampedTime = clamp(time)
            if (clampedTime == null) return

            const min = 1000

            const vr = new VR(
                clampedTime,
                clampedTime,
                line.timeline,
                duration,
                line,
                lines
            )

            const computed = vr.leftCompute()

            const end = line.durationMs + line.startMs
            let lineDuration = line.durationMs + line.startMs - computed

            if (lineDuration <= min) {
                lineDuration = min
                dispatch(
                    setDurationMs({
                        lineNumber: line.lineNumber,
                        value: lineDuration,
                    })
                )

                dispatch(
                    setStartMs({
                        lineNumber: line.lineNumber,
                        value: end - lineDuration,
                    })
                )
                return
            }

            dispatch(
                setDurationMs({
                    lineNumber: line.lineNumber,
                    value: lineDuration,
                })
            )

            dispatch(
                setStartMs({
                    lineNumber: line.lineNumber,
                    value: computed,
                })
            )
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

        const computeCursorLevel = (y: number) => {
            const offset = 96
            const docHeight = document.body.getBoundingClientRect().height

            if (docHeight - offset > y) {
                setCursorLevelTarget('primary')
            } else {
                setCursorLevelTarget('secondary')
            }
        }

        const moveElement = (time: number, cursor: number) => {
            let lineTime = clamp(time)
            const cursorTime = clamp(cursor)
            if (
                lineTime == undefined ||
                cursorTime == undefined ||
                cursorLevelTarget == null
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
                cursorLevelTarget,
                duration,
                line,
                lines
            )
            const vrComputed = vr.moveCompute()

            if (vrComputed === null) {
                setLocationTarget(line.startMs)
                setCursorLocation(lineTime)
                setLevelTarget(line.timeline)
                return null
            }

            if (vrComputed !== lineTime) {
                setCursorLocation(lineTime)
            } else setCursorLocation(null)

            setLocationTarget(vrComputed)
            return 1
        }

        const mouseup = () => {
            setTargetItem(null)
            setLocationTarget(null)
            setCursorLocation(null)
            setResizeType(null)
            setTargetOffsetPx(0)
            setCursorLevelTarget(null)

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
