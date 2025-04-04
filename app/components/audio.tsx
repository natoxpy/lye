import { useEffect, useState } from 'react'

export default function useAudio() {
    const [audio] = useState(new Audio('/music.mp3'))
    // Update values forces the values to update when using the component so the audio values can
    // be accessed directly as long as this value it is been modify it'll trigger rerender
    const [_update, setUpdate] = useState(0)

    useEffect(() => {
        const tint = setInterval(() => {
            setUpdate(audio.currentTime)
        })

        return () => {
            clearTimeout(tint)
        }
    }, [audio, _update])

    return {
        play() {
            setUpdate(-1)
            audio.play()
        },
        pause() {
            setUpdate(-1)
            audio.pause()
        },
        set src(source: string) {
            audio.src = source
        },
        set currentTime(time) {
            audio.currentTime = time
        },
        get currentTime() {
            return audio.currentTime
        },
        get duration() {
            return audio.duration || 0
        },
        get paused() {
            return audio.paused
        },
    }
}
