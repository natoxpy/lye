import { Fragment } from 'react'
import { useInternalDispatch, useInternalSelector } from './internalState'
import { SpacelessString } from './SpacelessString'

function EditorAddDividers() {
    const lyric = useInternalSelector((state) => state.lyric)
    const dividers = useInternalSelector((state) => state.dividers)
    const dispatch = useInternalDispatch()

    if (lyric == undefined) return <></>

    const slyric = SpacelessString.from(lyric)

    const select = (idx: number) => {
        if (new Set(dividers.map((divider) => divider.leftOffset)).has(idx)) {
            dispatch({
                type: 'dividers/remove',
                payload: idx
            })
        } else {
            dispatch({
                type: 'dividers/put',
                payload: {
                    leftOffset: idx
                }
            })
        }

        dispatch({
            type: 'slices/compute'
        })
    }

    return (
        <div className="relative h-full w-full flex items-center justify-center">
            {slyric.content.split('').map((char, idx) => (
                <Fragment key={idx}>
                    <span>{char}</span>

                    <div
                        onClick={() => select(idx + 1)}
                        style={{
                            display: idx == slyric.content.split('').length - 1 ? 'none' : 'flex',
                            width: new Set(slyric.offsetSpaceMap).has(idx + 1) ? '1.2rem' : '0.6rem'
                        }}
                        className="flex items-center justify-center h-14 cursor-pointer"
                    >
                        <div
                            style={{
                                display: new Set(dividers.map((divider) => divider.leftOffset)).has(
                                    idx + 1
                                )
                                    ? 'flex'
                                    : 'none'
                            }}
                            className="rounded-full min-w-[3px] min-h-[3px] bg-text-600"
                        ></div>
                    </div>
                </Fragment>
            ))}
        </div>
    )
}

export default function Component() {
    return (
        <div className="h-[6rem] w-full">
            <EditorAddDividers />
        </div>
    )
}
