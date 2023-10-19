import City, { defaultCity } from "./City";
import Hall from "./Hall";

interface Cinema {
    id: string,
    city: City,
    street: string,
    houseNumber: string,
    halls: Hall[] | null
}

export default Cinema

export let defaultCinema: Cinema = {
    id: '',
    city: defaultCity,
    street: '',
    houseNumber: '',
    halls: null
}