import Genre from "./Genre";
import People, { defaultPeople } from "./People";

interface Film {
    id: string | null,
    name: string,
    description: string,
    picture: string,
    trailer: string,
    original: string,
    director: People,
    actors: People[] | null,
    genres: Genre[] | null,
    titles: string[],
    dabings: string[],
    time: number,
    pg: number,
    cost: number,
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
    director: defaultPeople,
    actors: null,
    genres: null,
    titles: [],
    dabings: [],
    time: 0,
    pg: 0,
    cost: 0,
    production: new Date(),
    premier: new Date()
}