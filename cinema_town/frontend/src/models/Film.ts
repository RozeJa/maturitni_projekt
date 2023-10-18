import Genre from "./Genre";
import People from "./People";

interface Film {
    id: string,
    name: string,
    description: string,
    picture: string,
    trailer: string,
    original: string,
    director: People | string,
    actors: People[] | string[] | null,
    genres: Genre[] | string[] | null,
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
    id: '',
    name: '',
    description: '',
    picture: '',
    trailer: '',
    original: '',
    director: '',
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