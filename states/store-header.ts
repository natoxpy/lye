import { createStore } from 'zustand'

type HeaderState = {
    active: boolean
    tab: number
}

type HeaderActions = {
    actions: {
        setTab: (tab: number) => void
        setActive: (active: boolean) => void
    }
}

export type HeaderStore = HeaderState & HeaderActions
export const headerStore = createStore<HeaderStore>()((set) => {
    return {
        active: false,
        tab: 0,
        actions: {
            setTab(tab) {
                set(() => ({
                    tab,
                }))
            },

            setActive(active) {
                set(() => ({
                    active,
                }))
            },
        },
    }
})
