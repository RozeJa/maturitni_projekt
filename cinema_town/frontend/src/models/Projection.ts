import Entity from "./Entity";
import Film, { defaultFilm } from "./Film";
import Hall, { defaultHall } from "./Hall";

interface Projection extends Entity {
    hall: Hall,
    film: Film,
    cost: number,
    title: string,
    dabing: string,
    dateTime: Date | string[]
}

export default Projection

export let defaultProjection: Projection = {
    id: null,
    hall: defaultHall,
    film: defaultFilm,
    cost: -1,
    title: '',
    dabing: '',
    dateTime: new Date()
}