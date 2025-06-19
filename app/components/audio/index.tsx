import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

type Actions = { play: () => void; pause: () => void }
type State = {
    paused: boolean
    currentTime: number
    volume: number
    duration: number
    src: string
}

const AudioContext = createContext<State & Actions>({
    paused: false,
    currentTime: 0,
    duration: 0,
    volume: 0,
    src: '',
    pause() {},
    play() {},
})

export function useAudio() {
    return useContext(AudioContext)
}

export default function Provider({ children }: { children: React.ReactNode }) {
    const [, _setTick] = useState(0)
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

    const updateTick = useCallback(() => {
        _setTick((t) => {
            return t > 999_999 ? 0 : t + 1
        })
    }, [])

    useEffect(() => {
        const newaudio = new Audio()
        setAudio(newaudio)
    }, [setAudio, updateTick])

    useEffect(() => {
        const onLoadedData = () => {
            for (let i = 0; i < 5; i++) {
                setTimeout(updateTick, Math.pow(2, i))
            }
        }

        audio?.addEventListener('loadeddata', onLoadedData)
        return () => {
            audio?.removeEventListener('loadeddata', onLoadedData)
        }
    }, [audio, updateTick])

    useEffect(() => {
        const tint = setInterval(() => {
            if (!audio || (audio && audio.paused))
                return setTimeout(() => _setTick(0))

            updateTick()
        })

        return () => {
            clearTimeout(tint)
            if (!audio) return
            audio.pause()
        }
    }, [audio, updateTick])

    useEffect(() => {
        if (!audio) return

        const onkeydown = (e: KeyboardEvent) => {
            if (e.code != 'Space') return

            if (audio.paused) audio.play()
            else audio.pause()
        }

        document.addEventListener('keydown', onkeydown)
        return () => {
            document.removeEventListener('keydown', onkeydown)
        }
    })

    return (
        <AudioContext.Provider
            value={{
                get paused() {
                    return audio?.paused ?? true
                },

                get currentTime() {
                    return audio?.currentTime || 0
                },

                set currentTime(time: number) {
                    if (!audio) return
                    audio.currentTime = time
                    updateTick()
                },

                get volume() {
                    if (!audio) return 1
                    return audio.volume
                },

                set volume(vol: number) {
                    if (!audio) return
                    audio.volume = vol
                    updateTick()
                },

                get duration() {
                    return audio?.duration || 0
                },

                get src() {
                    return audio?.src ?? ''
                },

                set src(source: string) {
                    if (!audio) return
                    audio.src = source
                },
                play() {
                    if (!audio) return
                    audio.play()
                    updateTick()
                },
                pause() {
                    if (!audio) return
                    audio.pause()
                    updateTick()
                },
            }}
        >
            {children}
        </AudioContext.Provider>
    )
}
