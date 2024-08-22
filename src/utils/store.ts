import Store from 'electron-store'

const store = new Store();

function storeSet(key: string, value: any) {
    store.set(key, value)
}

function storeGet(key: string) {
    return store.get(key)
}

function storeDelete(key: string) {
    store.delete(key)
}

function storeClear() {
    store.clear()
}

export {
    storeSet,
    storeGet,
    storeDelete,
    storeClear
}