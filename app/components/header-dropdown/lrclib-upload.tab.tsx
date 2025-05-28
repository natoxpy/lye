import LeftArrowIcon from '@/app/components/icons/leftArrow'
import { forwardRef } from 'react'

const LrclibUploadTab = forwardRef<
    HTMLDivElement,
    {
        prevPage: () => void
        actions: {
            downloadLRCFile: () => void
        }
    }
>((props, ref) => {
    // const workspace = useLineSync((state) =>
    //     state.workspaces.find((w) => w.workspace == props.workspace)
    // )

    return (
        <div
            ref={ref}
            className="flex flex-col w-[300px] h-fit p-[15px] rounded-lg gap-[10px]"
        >
            <div className="flex items-center justify-between px-[10px]">
                <div className="flex items-center justify-start gap-[10px]">
                    <div
                        onClick={props.prevPage}
                        className="cursor-pointer text-txt-1 hover:text-txt-2"
                    >
                        <LeftArrowIcon />
                    </div>
                    <span className="text-txt-2 text-[18px]">LRCLIB</span>
                </div>
                <div className="text-txt-1">
                    <span className="text-[14px]">{}</span>
                </div>
            </div>
            <div className="flex items-center gap-2 justify-center px-[10px] py-[30px]">
                {/*}
                    <button
                        style={{
                            background: 'var(--color-accent-blue)',
                            width: '138px',
                            color: 'var(--color-txt-2)',
                        }}
                        onClick={() => {
                            const req = fetch(
                                'http://localhost:3300/api/request-challenge',
                                { method: 'post' }
                            )

                            req.then(async (r) => {
                                const data = await r.json()
                                console.log(data)
                            })
                        }}
                        className="cursor-pointer font-semibold flex items-center rounded-[6px] justify-center h-[49px]"
                    >
                        <span className="text-[16px]">Upload</span>
                    </button>
                    {*/}

                <button
                    style={{
                        background: 'var(--color-accent-blue)',
                        width: '138px',
                        color: 'var(--color-txt-2)',
                    }}
                    onClick={() => {
                        props.actions.downloadLRCFile()
                    }}
                    className="cursor-pointer font-semibold flex items-center rounded-[6px] justify-center h-[49px]"
                >
                    <span className="text-[16px]">LRC Download</span>
                </button>
            </div>
        </div>
    )
})

LrclibUploadTab.displayName = 'LrclibUploadTab'
export default LrclibUploadTab
