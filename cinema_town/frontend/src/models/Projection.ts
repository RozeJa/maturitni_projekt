import Film, { defaultFilm } from "./Film";
import Hall, { defaultHall } from "./Hall";

interface Projection {
    id: string | null,
    hall: Hall,
    film: Film,
    cost: number,
    title: string,
    dabing: string,
    dateTime: Date
}

export default Projection

export let defaultProjection: Projection = {
    id: null,
    hall: defaultHall,
    film: defaultFilm,
    cost: 0,
    title: '',
    dabing: '',
    dateTime: new Date()
}