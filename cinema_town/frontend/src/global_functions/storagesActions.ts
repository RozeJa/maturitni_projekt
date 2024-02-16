export function getSessionStorageItem(key: string): string {
    const value = sessionStorage.getItem(key)
    if (typeof value === 'string') {
        return value
    } else {
        return ''
    }
}

export function getLocalStorageItem(key: string): string {
    const value = localStorage.getItem(key)
    if (typeof value === 'string') {
        return value
    } else { 
        return ''
    }
}

export function setSessionsStorageItem(key: string, value: string) {
    sessionStorage.setItem(key, value)
}