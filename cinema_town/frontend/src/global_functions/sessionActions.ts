export function getSessionStorageItem(key: string): string {
    const value = sessionStorage.getItem(key)
    if (typeof value === 'string') {
        return value
    } else {
        return ''
    }
}