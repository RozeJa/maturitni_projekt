import Film, { defaultFilm } from "./Film";
import Hall, { defaultHall } from "./Hall";

interface Projection {
    id: string | null,
    hall: Hall,
    film: Film,
    title: string,
    dabing: string,
    date: Date,
    time: Date
}

export default Projection

export let defaultProjection: Projection = {
    id: null,
    hall: defaultHall,
    film: defaultFilm,
    title: '',
    dabing: '',
    date: new Date(),
    time: new Date()
}