import Film from "./Film";
import Hall from "./Hall";

interface Projection {
    id: string,
    hall: Hall,
    film: Film,
    title: string,
    dabing: string,
    date: Date,
    time: Date
}

export default Projection