/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject } from 'react'

async function getAudioBuffer(files: FileList): Promise<ArrayBuffer> {
    return new Promise((res, rej) => {
        const file = Array.from(files)[0]
        if (!file || (file && !file.type.startsWith('audio/'))) return
        const n = new FileReader()
        n.readAsArrayBuffer(file)

        n.onload = () => res(n.result as ArrayBuffer)
        n.onerror = () => rej(n.error)
    })
}

async function getAudioPicture(arrayBuffer: ArrayBuffer): Promise<ArrayBuffer> {
    const jsmediatags = (window as any).jsmediatags
    const blob = new Blob([arrayBuffer])

    return new Promise((res, rej) => {
        jsmediatags.read(blob, {
            onSuccess: (tag: any) => {
                const picture = tag.tags['picture']
                if (!picture)
                    return rej(new Error('Image in metadata not found'))
                res(new Uint8Array(picture.data).buffer)
            },
            onError: (error: never) => rej(error),
        })
    })
}

export default function Component({
    innerRef,
    onChange,
}: {
    innerRef: RefObject<HTMLInputElement>
    onChange: (audio: Blob, audioCover?: Blob) => void
}) {
    return (
        <input
            ref={innerRef}
            type="file"
            className="hidden"
            onChange={async (e) => {
                const files = e.target.files
                if (files == null) return

                getAudioBuffer(files)
                    .then((audiobuffer) => {
                        const audioBlob = new Blob([audiobuffer])

                        getAudioPicture(audiobuffer)
                            .then((picturebuffer) => {
                                const audioCoverBlob = new Blob([picturebuffer])
                                onChange(audioBlob, audioCoverBlob)
                            })
                            .catch(() => {
                                onChange(audioBlob)
                                console.log(
                                    'The audio you included likely did not have a cover image, or was not part of the compatible formats (ID3, MP4, or FLAC)'
                                )
                            })
                    })
                    .catch((err) =>
                        console.error(
                            err,
                            'The file you included were not identify as proper audio files or something else went wrong.'
                        )
                    )
            }}
        />
    )
}
