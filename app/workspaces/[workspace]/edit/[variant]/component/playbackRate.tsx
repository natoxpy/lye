import PlaybackIcon from '@/app/components/icons/playback'
import {
    usePlayerDispatch,
    usePlayerState,
} from '@/app/components/player/state'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function PlaybackRate() {
    const { playbackRate } = usePlayerState()
    const dispatch = usePlayerDispatch()
    const [rates] = useState([2, 1.5, 1, 0.75, 0.5, 0.25])
    const [focused, setFocused] = useState(false)
    const root = useRef<HTMLButtonElement>(null)

    const selectUp = useCallback(() => {
        let payload = 0
        const index = rates.findIndex((rate) => playbackRate === rate)
        if (index <= 0) payload = rates[0]
        else payload = rates[index - 1]

        dispatch({ type: 'set-playbackRate', payload })
    }, [rates, dispatch, playbackRate])

    const selectBottom = useCallback(() => {
        let payload = 0
        const index = rates.findIndex((rate) => playbackRate === rate)
        const max = rates.length
        if (index >= max - 1) payload = rates[max - 1]
        else payload = rates[index + 1]

        dispatch({ type: 'set-playbackRate', payload })
    }, [rates, dispatch, playbackRate])

    useEffect(() => {
        const menu = root.current
        if (menu == null) return

        const keydown = (e: KeyboardEvent) => {
            if (!focused) return

            if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
                setFocused(false)
                menu.focus()
            }

            if (e.key == 'ArrowUp') selectUp()
            else if (e.key == 'ArrowDown') selectBottom()
        }

        document.addEventListener('keydown', keydown)
        return () => document.removeEventListener('keydown', keydown)
    }, [root, focused, setFocused, selectBottom, selectUp])

    return (
        <button
            tabIndex={0}
            ref={root}
            className="relative outline-none group flex items-center min-w-[80px] max-w-[80px] h-full px-[10px] gap-[0px]"
            onKeyDown={(e) => {
                if (e.key == 'ArrowUp') selectUp()
                else if (e.key == 'ArrowDown') selectBottom()
            }}
            onMouseEnter={() => setFocused(true)}
            onMouseLeave={() => {
                root.current?.blur()
                setFocused(false)
            }}
        >
            <div className="w-full">
                <PlaybackIcon className="fill-txt-1 stroke-txt-1" />
            </div>
            <div className="flex justify-start items-center w-full">
                <span className="group-focus:text-accent-1 group-hover:text-accent-1 text-txt-1 text-[12px]">
                    {playbackRate}x
                </span>
            </div>

            <ul className="group-focus:flex group-hover:flex flex-col hidden bg-bg-2 absolute bottom-8 rounded-[3px] border-[1px] border-bg-5">
                {rates.map((rate) => {
                    return (
                        <li
                            key={rate}
                            style={{
                                backgroundColor:
                                    playbackRate == rate
                                        ? 'var(--color-bg-5)'
                                        : '',
                                color:
                                    playbackRate == rate
                                        ? 'var(--color-txt-2)'
                                        : '',
                            }}
                            className="hover:bg-bg-4 w-[60px] py-[4px] text-txt-1 text-[12px]"
                            onClick={() => {
                                dispatch({
                                    type: 'set-playbackRate',
                                    payload: rate,
                                })
                            }}
                        >
                            {rate}x
                        </li>
                    )
                })}
            </ul>
        </button>
    )
}
