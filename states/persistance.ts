import { Workspace, workspacesStore } from './store-workspaces'
import { PlainLyrics, plainLyricsStore } from './store-plain-lyrics'

export const PersistanceEmitter = new EventTarget()

export function triggerPersistanceEvent() {
    PersistanceEmitter.dispatchEvent(new Event('rerender'))
}

export async function loadAll() {
    const workspaces = await getAllWorkspace()
    const plainlines = await getAllPlainlines()

    workspacesStore.getState().actions.setWorkspaces(workspaces)
    plainLyricsStore.setState({
        lyrics: plainlines,
    })

    triggerPersistanceEvent()
}

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

export function Database(): Promise<IDBDatabase> {
    return new Promise((res, rej) => {
        const openRequest = indexedDB.open('store', 1)

        openRequest.onupgradeneeded = (event) => {
            const db = openRequest.result

            switch (event.oldVersion) {
                case 0:
                    db.createObjectStore('workspaces', { keyPath: 'id' })
                    db.createObjectStore('plainlines', { keyPath: 'id' })
                    db.createObjectStore('synclines', { keyPath: 'id' })
                    break
            }
        }

        openRequest.onerror = () => rej(openRequest.error)
        openRequest.onsuccess = () => res(openRequest.result)
    })
}
