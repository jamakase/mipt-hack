export interface Pageable {
    size: number
    offset: number
    sortBy: string
    sort: 'asc'|'desc'
}

export interface Page<T> {
    content: T[]
    total: number
}