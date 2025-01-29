import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import WorkspacesTab from './workspaces-tab'
import WorkspaceItemTab from './workspace-item-tab'
import LrclibUploadTab from './lrclib-upload.tab'

export default function Dropdown({
    tab: [tabIndex, setTabIndex],
    active: [active],
}: {
    tab: [number, Dispatch<SetStateAction<number>>]
    active: [boolean, Dispatch<SetStateAction<boolean>>]
}) {
    const transitionSpeed = '250ms'

    const tab1 = useRef<HTMLDivElement>(null)
    const tab2 = useRef<HTMLDivElement>(null)
    const tab3 = useRef<HTMLDivElement>(null)

    const [tabsize, setTabsize] = useState<Array<{ w: number; h: number }>>([])

    useEffect(() => {
        setTabsize((n) => {
            n = []
            n.push({
                w: tab1.current?.getBoundingClientRect().width ?? 0,
                h: tab1.current?.getBoundingClientRect().height ?? 0,
            })

            n.push({
                w: tab2.current?.getBoundingClientRect().width ?? 0,
                h: tab2.current?.getBoundingClientRect().height ?? 0,
            })

            n.push({
                w: tab3.current?.getBoundingClientRect().width ?? 0,
                h: tab3.current?.getBoundingClientRect().height ?? 0,
            })

            return [...n]
        })
    }, [tab1, tab2, tab3, tabIndex])

    const getOffset = useCallback(() => {
        return tabsize
            .filter((_, i) => i < tabIndex)
            .reduce((t, c) => t + c.w, 0)
    }, [tabsize, tabIndex])

    const childNodes = (
        <>
            <div
                style={{
                    width: tabsize[tabIndex]?.w ?? 0 + 'px',
                    height: tabsize[tabIndex]?.h ?? 0 + 'px',
                    transitionDuration: transitionSpeed,
                }}
                className="w-fit h-fit overflow-hidden bg-bg-2 rounded-lg transition-all ease-in-out"
            >
                <div
                    style={{
                        width: '2000px',
                        left: -getOffset() + 'px',
                        transitionDuration: transitionSpeed,
                    }}
                    className="relative flex left-5 transition-all ease-in-out"
                >
                    <WorkspacesTab
                        selectItem={() => setTabIndex((n) => n + 1)}
                        ref={tab1}
                    />
                    <WorkspaceItemTab
                        prevPage={() => setTabIndex((n) => n - 1)}
                        nextPage={() => setTabIndex((n) => n + 1)}
                        ref={tab2}
                    />
                    <LrclibUploadTab
                        prevPage={() => setTabIndex((n) => n - 1)}
                        ref={tab3}
                    />
                </div>
            </div>
        </>
    )

    const dropdownWrapper = (
        <>
            <div
                style={{
                    maxHeight: !active ? '0px' : tabsize[tabIndex]?.h,
                }}
                className="z-30 absolute left-1/2 overflow-hidden -translate-x-1/2 text-white top-12 transition-all ease-in-out shadow-xl"
            >
                <div>{childNodes}</div>
            </div>
        </>
    )

    return dropdownWrapper
}
