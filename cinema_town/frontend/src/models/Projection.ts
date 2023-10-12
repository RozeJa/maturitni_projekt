import Film from "./Film";
import Hall from "./Hall";

interface Projection {
    id: string,
    hall: Hall | string,
    film: Film | string,
    title: string,
    dabing: string,
    date: Date,
    time: Date
}

export default Projection