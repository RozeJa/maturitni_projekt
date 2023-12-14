import Genre from "./Genre";
import People, { defaultPeople } from "./People";
import Entity from "./Entity";

interface Film extends Entity {
    name: string,
    description: string,
    picture: string,
    trailer: string,
    original: string,
    blockBuster: boolean
    director: People,
    actors: { [key: string]: People } | null,
    genres: Genre[],
    titles: string[],
    dabings: string[],
    time: number,
    pg: number,
    defaultCost: number,
    production: string,
    premier: Date | string[],
    file?: any
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
    genres: [],
    titles: [],
    dabings: [],
    time: 0,
    pg: 3,
    defaultCost: 0,
    production: '',
    premier: new Date()
}