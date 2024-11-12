'use client'
import { useEffect, useState } from 'react'
import { usePlayerDispatch, usePlayerState } from './state'
import { timeConverter, floor } from './utils'
import { Seconds } from '../utils/units'

type Props = { children: React.ReactNode }

export default function Component({ children }: Props) {
    const { paused, src, playbackRate, targetCurrentTime, volume } =
        usePlayerState()
    const dispatch = usePlayerDispatch()

    const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

    useEffect(() => {
        setAudio(new Audio())
    }, [setAudio])

    useEffect(() => {
        if (audio == null) return

        audio.onpause = () => dispatch({ type: 'set-paused', payload: true })
        audio.onplay = () => dispatch({ type: 'set-paused', payload: false })
        audio.ondurationchange = () =>
            dispatch({
                type: 'set-duration',
                payload: floor(timeConverter.StoMS(audio.duration as Seconds)),
            })

        dispatch({ type: 'set-src', payload: '/music2.mp3' })
    }, [audio, dispatch])

    useEffect(() => {
        if (audio == null || src == null) return
        audio.src = src
    }, [src, audio])

    useEffect(() => {
        if (audio == null) return
        if (audio.paused == paused) return

        if (audio.paused) audio.play()
        else audio.pause()
    }, [paused, audio])

    useEffect(() => {
        if (audio == null) return
        if (audio.playbackRate == playbackRate) return
        audio.playbackRate = playbackRate
    }, [audio, playbackRate])

    useEffect(() => {
        if (audio == null) return
        const i = setInterval(() => {
            if (paused) return

            dispatch({
                type: 'set-currentTime',
                payload: floor(
                    timeConverter.StoMS(audio.currentTime as Seconds)
                ),
            })
        }, 10)

        return () => clearInterval(i)
    }, [audio, paused, dispatch])

    useEffect(() => {
        if (audio == null) return
        if (targetCurrentTime == null) return

        audio.currentTime = targetCurrentTime

        dispatch({
            type: 'sync-currentTime',
            payload: null,
        })
    }, [audio, targetCurrentTime, dispatch])

    useEffect(() => {
        if (audio == null) return
        audio.volume = volume
    }, [volume, audio])

    return <>{children}</>
}
