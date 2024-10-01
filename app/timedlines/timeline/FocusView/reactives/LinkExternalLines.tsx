///
/// This component is allowed to access and modify external state
///

import * as TimedlinesActions from '@/lib/timedlines'
import { useEffect } from 'react'
import { Line, useInternalSelector } from '../internalState'
import { TimedLinesLine } from '@/app/cachedb/timedlines'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shallowEqual(object1: any, object2: any) {
    const keys1 = Object.keys(object1)
    const keys2 = Object.keys(object2)

    if (keys1.length !== keys2.length) {
        return false
    }

    for (const key of keys1) {
        if (object1[key] !== object2[key]) {
            return false
        }
    }

    return true
}

function CompareEquals(lhs: TimedLinesLine[], rhs: TimedLinesLine[]) {
    if (lhs.length !== rhs.length) return false
    lhs = lhs.toSorted((a, b) => a.linenumber - b.linenumber)
    rhs = rhs.toSorted((a, b) => a.linenumber - b.linenumber)

    for (let i = 0; i < lhs.length; i++) {
        const LItem = lhs[i]
        const RItem = rhs[i]

        if (!shallowEqual(LItem, RItem)) return false
    }

    return true
}

export default function ReactiveComponent() {
    const dispatch = useAppDispatch()
    const lines = useInternalSelector((state) => state.lines)
    const timedlines = useAppSelector((state) => state.timedlines)

    useEffect(() => {
        const map = (line: Line) =>
            ({
                start: line.start,
                end: line.end,
                linenumber: line.line,
                displayLineNumber: line.displayLine,
                uhash: line.uhash
            }) satisfies TimedLinesLine

        const primary = lines.filter((line) => line.timeline == 'primary').map(map)
        const secondary = lines.filter((line) => line.timeline == 'secondary').map(map)

        if (
            CompareEquals(timedlines.primary, primary) &&
            CompareEquals(timedlines.secondary, secondary)
        )
            return

        dispatch(
            TimedlinesActions.loadAll({
                primary,
                secondary
            })
        )
    }, [lines])

    return <></>
}
