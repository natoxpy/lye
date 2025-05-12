import { createStore } from 'zustand'
import { addSectionedLyrics, updateSectionedLyrics } from './persistance'
import { HEADER_PREFIX } from '@/app/components/editor'

export type Section = {
    header: string
    start: number
    lines: string[]
    timeframe: { start: number | null; end: number | null }
}

export type SectionedLyrics = {
    id: string
    workspace: string
    sections: Section[]
}

type Store = {
    workspaces: SectionedLyrics[]
}

type Actions = {
    actions: {
        add: (workspace: string, sections: Section[]) => void
        update: (workspace: string, sections: Section[]) => void
        updateRange: (
            workspace: string,
            start: number,
            startTime?: number,
            endTime?: number
        ) => void

        delete: (workspace: string) => void
    }
}

export type SectionedLyricsStore = Store & Actions

export const sectionedLyricsStore = createStore<SectionedLyricsStore>()(
    (set) => ({
        workspaces: [],
        actions: {
            add: (workspace, sections) => {
                set((state) => {
                    const id = crypto.randomUUID()

                    addSectionedLyrics({ workspace, sections, id })
                    state.workspaces.push({ workspace, sections, id })

                    return state
                })
            },

            update: (workspace, sections) => {
                set((state) => {
                    const index = state.workspaces.findIndex(
                        (w) => w.workspace == workspace
                    )

                    if (index == -1) return state

                    updateSectionedLyrics({
                        workspace: workspace,
                        id: state.workspaces[index].id,
                        sections: sections,
                    })

                    state.workspaces[index].sections = sections

                    return state
                })
            },

            updateRange: (workspace, start, startTime, endTime) => {
                set((state) => {
                    const index = state.workspaces.findIndex(
                        (w) => w.workspace == workspace
                    )

                    if (index == -1) return state

                    const sectionIndex = state.workspaces[
                        index
                    ].sections.findIndex((sec) => sec.start == start)

                    if (sectionIndex == -1) return state

                    if (startTime != undefined)
                        state.workspaces[index].sections[
                            sectionIndex
                        ].timeframe.start = startTime

                    if (endTime != undefined)
                        state.workspaces[index].sections[
                            sectionIndex
                        ].timeframe.end = endTime

                    updateSectionedLyrics({
                        workspace: workspace,
                        id: state.workspaces[index].id,
                        sections: state.workspaces[index].sections,
                    })

                    return state
                })
            },

            delete: (workspace) => {
                set((state) => {
                    state.workspaces.findIndex((w) => w.workspace == workspace)
                    return state
                })
            },
        },
    })
)

export function SectionedParse(
    plainlyrics: string
): Array<{ header: string; lines: Array<string> }> {
    const plainSections = plainlyrics.split(HEADER_PREFIX).slice(1)

    const sections = plainSections.map((ps) => {
        const lines = ps.split('\n')
        return {
            header: lines[0],
            lines: lines.slice(1),
        }
    })

    return sections
}
