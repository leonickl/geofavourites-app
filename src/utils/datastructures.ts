export function queue<T>(name: string) {
    const raw = localStorage.getItem(name)
    const list = raw ? JSON.parse(raw) : []

    return {
        put: (item: T) => localStorage.setItem(name, JSON.stringify([...list, item])),
        pop: () => {
            localStorage.setItem(name, JSON.stringify(list.slice(1)))
            return list[0]
        },
        size: () => list.length
    }
}