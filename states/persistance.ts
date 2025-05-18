import { Workspace, workspacesStore } from './store-workspaces'
import { Lyrics, lyricsStore } from './store-lyrics'
import { LineSync, lineSyncStore } from './store-line-sync'

import { PlainLyrics } from './store-plain-lyrics'
import { SectionedLyrics } from './store-sectioned-lyrics'

export const PersistanceEmitter = new EventTarget()

export function triggerPersistanceEvent() {
    PersistanceEmitter.dispatchEvent(new Event('rerender'))
    LyricsDatabase.emitReRender()
}

export async function loadAll() {
    const workspaces = await getAllWorkspace()
    workspacesStore.getState().actions.setWorkspaces(workspaces)
    lyricsStore.setState({
        workspaces: await LyricsDatabase.getAll(),
    })
    lineSyncStore.setState({
        workspaces: await LineSyncDatabase.getAll(),
    })

    // const plainlines = await getAllPlainlines()
    // const sectionedLyrics = await getAllSectionedLyrics()

    // plainLyricsStore.setState({
    //     lyrics: plainlines,
    // })

    // sectionedLyricsStore.setState({
    //     workspaces: sectionedLyrics,
    // })

    triggerPersistanceEvent()
}

//
// OOP persistance system
//

export class DatabaseStore<T> {
    public event: EventTarget = new EventTarget()

    constructor(private storeName: string) {}

    public emit(type: string) {
        PersistanceEmitter.dispatchEvent(new Event(type))
    }

    public emitReRender() {
        this.emit('rerender')
    }

    public onReRender(cb: EventListenerOrEventListenerObject) {
        this.event.addEventListener('rerender', cb)
    }

    public removeReRender(cb: EventListenerOrEventListenerObject) {
        this.event.removeEventListener('rerender', cb)
    }

    public async add(value: T): Promise<IDBValidKey> {
        const database = await Database()
        const transaction = database.transaction(this.storeName, 'readwrite')
        const store = transaction.objectStore(this.storeName)
        const request = store.add(value)

        return new Promise((res, rej) => {
            request.onerror = () => rej(request.error)
            request.onsuccess = () => res(request.result)
        })
    }

    public async update(value: T): Promise<IDBValidKey> {
        const database = await Database()
        const transaction = database.transaction(this.storeName, 'readwrite')
        const store = transaction.objectStore(this.storeName)
        const request = store.put(value)

        return new Promise((res, rej) => {
            request.onerror = () => rej(request.error)
            request.onsuccess = () => res(request.result)
        })
    }

    public async get(query: IDBValidKey | IDBKeyRange): Promise<T> {
        const database = await Database()
        const transaction = database.transaction(this.storeName, 'readonly')
        const store = transaction.objectStore(this.storeName)
        const request = store.get(query)

        return new Promise((res, rej) => {
            request.onerror = () => rej(request.error)
            request.onsuccess = () => {
                if (request.result !== undefined) res(request.result)
                else rej(request.error)
            }
        })
    }

    public async getAll(): Promise<T[]> {
        const database = await Database()
        const transaction = database.transaction(this.storeName, 'readonly')
        const store = transaction.objectStore(this.storeName)
        const request = store.getAll()

        return new Promise((res, rej) => {
            request.onerror = () => rej(request.error)
            request.onsuccess = () => {
                if (request.result !== undefined) res(request.result)
                else rej(request.error)
            }
        })
    }

    public async delete(query: IDBValidKey | IDBKeyRange) {
        const database = await Database()
        const transaction = database.transaction(this.storeName, 'readwrite')
        const store = transaction.objectStore(this.storeName)
        const request = store.delete(query)

        return new Promise((res, rej) => {
            request.onsuccess = () => res(undefined)
            request.onerror = () => rej()
        })
    }
}

export const WorkspacesDatabase = new DatabaseStore<Workspace>('workspaces')
export const LyricsDatabase = new DatabaseStore<Lyrics>('lyrics')
export const LineSyncDatabase = new DatabaseStore<LineSync>('linesync')

//
// Old persistance system
//

export async function addWorkspace(workspace: Workspace) {
    const database = await Database()
    const transaction = database.transaction('workspaces', 'readwrite')
    const store = transaction.objectStore('workspaces')
    store.add(workspace)
}

export async function addPlainlines(plainlyrics: PlainLyrics) {
    const database = await Database()
    const transaction = database.transaction('plainlines', 'readwrite')
    const store = transaction.objectStore('plainlines')
    store.add(plainlyrics)
}

export async function addSectionedLyrics(sectionedLyrics: SectionedLyrics) {
    const database = await Database()
    const transaction = database.transaction('sectionedLyrics', 'readwrite')
    const store = transaction.objectStore('sectionedLyrics')
    store.add(sectionedLyrics)
}

export async function updateWorkspace(workspace: Workspace) {
    const database = await Database()
    const transaction = database.transaction('workspaces', 'readwrite')
    const store = transaction.objectStore('workspaces')
    store.put(workspace)
}

export async function updatePlainlyrics(plainlyrics: PlainLyrics) {
    const database = await Database()
    const transaction = database.transaction('plainlines', 'readwrite')
    const store = transaction.objectStore('plainlines')
    store.put(plainlyrics)
}

export async function updateSectionedLyrics(sectionedLyrics: SectionedLyrics) {
    const database = await Database()
    const transaction = database.transaction('sectionedLyrics', 'readwrite')
    const store = transaction.objectStore('sectionedLyrics')
    store.put(sectionedLyrics)
}

export async function getWorkspace(id: string): Promise<Workspace> {
    const database = await Database()
    const transaction = database.transaction('workspaces', 'readonly')
    const store = transaction.objectStore('workspaces')
    const request = store.get(id)

    return new Promise((res, rej) => {
        request.onerror = () => rej(request.error)
        request.onsuccess = () => {
            if (request.result !== undefined) res(request.result)
            else rej(request.error)
        }
    })
}

export async function getPlainlines(id: string): Promise<PlainLyrics> {
    const database = await Database()
    const transaction = database.transaction('plainlines', 'readonly')
    const store = transaction.objectStore('plainlines')
    const request = store.get(id)

    return new Promise((res, rej) => {
        request.onerror = () => rej(request.error)
        request.onsuccess = () => {
            if (request.result !== undefined) res(request.result)
            else rej(request.error)
        }
    })
}

export async function getSectionedLyrics(id: string): Promise<SectionedLyrics> {
    const database = await Database()
    const transaction = database.transaction('sectionedLyrics', 'readonly')
    const store = transaction.objectStore('sectionedLyrics')
    const request = store.get(id)

    return new Promise((res, rej) => {
        if (request.result !== undefined) res(request.result)
        else rej(request.error)
    })
}

export async function getAllWorkspace(): Promise<Workspace[]> {
    const database = await Database()
    const transaction = database.transaction('workspaces', 'readonly')
    const store = transaction.objectStore('workspaces')
    const request = store.getAll()

    return new Promise((res, rej) => {
        request.onerror = () => rej(request.error)
        request.onsuccess = () => {
            if (request.result !== undefined) res(request.result)
            else rej(request.error)
        }
    })
}

export async function getAllPlainlines(): Promise<PlainLyrics[]> {
    const database = await Database()
    const transaction = database.transaction('plainlines', 'readonly')
    const store = transaction.objectStore('plainlines')
    const request = store.getAll()

    return new Promise((res, rej) => {
        request.onerror = () => rej(request.error)
        request.onsuccess = () => {
            if (request.result !== undefined) res(request.result)
            else rej(request.error)
        }
    })
}

export async function getAllSectionedLyrics(): Promise<SectionedLyrics[]> {
    const database = await Database()
    const transaction = database.transaction('sectionedLyrics', 'readonly')
    const store = transaction.objectStore('sectionedLyrics')
    const request = store.getAll()

    return new Promise((res, rej) => {
        request.onerror = () => rej(request.error)
        request.onsuccess = () => {
            if (request.result !== undefined) res(request.result)
            else rej(request.error)
        }
    })
}

export async function deleteWorkspace(id: string) {
    const database = await Database()
    const transaction = database.transaction('workspaces', 'readwrite')
    const store = transaction.objectStore('workspaces')
    store.delete(id)
}

export async function deletePlainlines(id: string) {
    const database = await Database()
    const transaction = database.transaction('plainlines', 'readwrite')
    const store = transaction.objectStore('plainlines')
    store.delete(id)
}

export async function deleteSectionedLyrics(id: string) {
    const database = await Database()
    const transaction = database.transaction('sectionedLyrics', 'readwrite')
    const store = transaction.objectStore('sectionedLyrics')
    store.delete(id)
}

export function Database(): Promise<IDBDatabase> {
    return new Promise((res, rej) => {
        const openRequest = indexedDB.open('store', 1)

        openRequest.onupgradeneeded = (event) => {
            const db = openRequest.result

            switch (event.oldVersion) {
                case 0:
                    db.createObjectStore('workspaces', { keyPath: 'id' })
                    db.createObjectStore('lyrics', { keyPath: 'id' })
                    db.createObjectStore('linesync', { keyPath: 'id' })

                    // db.createObjectStore('plainlines', { keyPath: 'id' })
                    // db.createObjectStore('sectionedLyrics', { keyPath: 'id' })
                    // db.createObjectStore('synclines', { keyPath: 'id' })
                    break
            }
        }

        openRequest.onerror = () => rej(openRequest.error)
        openRequest.onsuccess = () => res(openRequest.result)
    })
}
