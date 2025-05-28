import { createStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { LineSyncDatabase } from './persistance'
import { LyricsSection } from './store-lyrics'

export type LineSyncContent = {
    targetId: string
    timerange: {
        start: number
        end: number
    }
}

export type LineSync = {
    id: string
    workspace: string
    content: LineSyncContent[]
}

export type LineSyncState = {
    workspaces: LineSync[]
}

export type LineSyncAction = {
    actions: {
        add: (linesync: LineSync) => void
        update: (workspace: string, content: LineSyncContent[]) => void
        delete: (workspace: string) => void
        lineSyncItems: {
            add: (workspace: string, lineContent: LineSyncContent) => void
            update: (
                workspace: string,
                targetId: string,
                timerange: LineSyncContent['timerange']
            ) => void
            delete: (workspace: string, targetId: string) => void
        }
    }
}

export type LineSyncStore = LineSyncState & LineSyncAction

export const lineSyncStore = createStore<LineSyncStore>()(
    immer((set) => ({
        workspaces: [],
        actions: {
            add: (linesync) => {
                set((store) => {
                    store.workspaces.push(linesync)
                    LineSyncDatabase.add(linesync)
                })
            },
            update: (workspace, linesyncs) => {
                set((store) => {
                    const index = store.workspaces.findIndex(
                        (w) => w.workspace == workspace
                    )
                    if (index == -1) return

                    store.workspaces[index].content = linesyncs
                    LineSyncDatabase.update({ ...store.workspaces[index] })
                })
            },
            delete: (workspace) => {
                set((store) => {
                    const linesync = store.workspaces.find(
                        (w) => w.workspace == workspace
                    )

                    if (linesync == undefined) return

                    LineSyncDatabase.delete(linesync.id)

                    store.workspaces = store.workspaces.filter(
                        (w) => w.id != linesync.id
                    )
                })
            },
            lineSyncItems: {
                add: (workspace, lineSyncItem) => {
                    set((store) => {
                        const wpIndex = store.workspaces.findIndex(
                            (item) => item.workspace == workspace
                        )
                        if (wpIndex == -1) return

                        const lsIndex = store.workspaces[
                            wpIndex
                        ].content.findIndex(
                            (item) => item.targetId == lineSyncItem.targetId
                        )

                        // Stops same target to be added twice
                        if (lsIndex != -1) return

                        store.workspaces[wpIndex].content.push(lineSyncItem)

                        LineSyncDatabase.update(
                            JSON.parse(
                                JSON.stringify(store.workspaces[wpIndex])
                            )
                        )
                    })
                },
                update: (workspace, targetId, timerange) => {
                    set((store) => {
                        const wpIndex = store.workspaces.findIndex(
                            (item) => item.workspace == workspace
                        )
                        if (wpIndex == -1) return

                        const ls = store.workspaces[wpIndex].content.find(
                            (item) => item.targetId == targetId
                        )

                        if (ls == undefined) return
                        ls.timerange = timerange

                        LineSyncDatabase.update(
                            JSON.parse(
                                JSON.stringify(store.workspaces[wpIndex])
                            )
                        )
                    })
                },
                delete: (workspace, targetId) => {
                    set((store) => {
                        const wpIndex = store.workspaces.findIndex(
                            (item) => item.workspace == workspace
                        )
                        if (wpIndex == -1) return

                        store.workspaces[wpIndex].content = store.workspaces[
                            wpIndex
                        ].content.filter((item) => item.targetId != targetId)

                        LineSyncDatabase.update(
                            JSON.parse(
                                JSON.stringify(store.workspaces[wpIndex])
                            )
                        )
                    })
                },
            },
        },
    }))
)

export function getLineSyncCount(
    lyrics?: LyricsSection[],
    linesyncs?: LineSyncContent[]
) {
    if (!lyrics || !linesyncs) return 0

    let acc = 0

    const inLineSync = (targetId: string) =>
        linesyncs.findIndex((l) => l.targetId == targetId) != 1

    for (const section of lyrics) {
        for (const line of section.content) {
            if (inLineSync(line.id)) acc += 1
        }
    }

    return acc
}
