import { useEffect } from 'react'
import { useLocalState } from '../state'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setStartMs } from '@/store/stores/synclines'
import { usePlayerState } from '@/app/player/state'

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
        setTargetItem,
        setLocationTarget,
    } = useLocalState()
    const { duration } = usePlayerState()
    const lines = useAppSelector((state) => state.syncLines.lines)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const mousemove = (e: MouseEvent) => {
            if (targetItem == null || targetOffsetPx == null) return
            let x = e.clientX - leftOffset - targetOffsetPx
            if (x < 0) x = 0
            if (canvasWidthPx < x) x = canvasWidthPx
            moveElement(Math.floor((x / canvasWidthPx) * timeWidth))
        }

        const moveElement = (time: number) => {
            if (targetItem == null) return
            const items = visibleMarks.map((item, id) => [
                Math.abs(time - item),
                id,
            ])

            items.sort((a, b) => a[0] - b[0])

            let lineTime = timeOffset + visibleMarks[items[0][1]]
            const line = lines.find((item) => item.lineNumber === targetItem)
            const lineDuration = line?.durationMs ?? 0

            if (lineTime + lineDuration >= duration)
                lineTime = duration - lineDuration

            setLocationTarget(lineTime)
        }

        const mouseup = () => {
            setTargetItem(null)
            setLocationTarget(null)

            if (targetItem == null || locationTarget == null) return

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
