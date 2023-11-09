import People, { defaultPeople } from "./People";

interface Film {
    id: string | null,
    name: string,
    description: string,
    picture: string,
    trailer: string,
    original: string,
    blockBuster: boolean
    director: People,
    actors: Object | null,
    genres: Object | null,
    titles: string[],
    dabings: string[],
    time: number,
    pg: number,
    defaultCost: number,
    production: Date,
    premier: Date
}

export default Film

export let defaultFilm: Film = {
    id: null,
    name: '',
    description: '',
    picture: '',
    trailer: '',
    original: '',
    blockBuster: false,
    director: defaultPeople,
    actors: null,
    genres: null,
    titles: [],
    dabings: [],
    time: 0,
    pg: 0,
    defaultCost: 0,
    production: new Date(),
    premier: new Date()
}