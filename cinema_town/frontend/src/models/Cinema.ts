import City, { defaultCity } from "./City";
import Hall from "./Hall";

interface Cinema {
    id: string | null,
    city: City,
    street: string,
    houseNumber: string,
    halls: Map<string, Hall> | null
}

export default Cinema

export let defaultCinema: Cinema = {
    id: null,
    city: defaultCity,
    street: '',
    houseNumber: '',
    halls: null
}