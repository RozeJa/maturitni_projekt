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
    actors: People[] | string[],
    genres: Genre[] | string[],
    titles: string[],
    dabings: string[],
    time: number,
    pg: number,
    cost: number,
    production: Date,
    premier: Date
}

export default Film