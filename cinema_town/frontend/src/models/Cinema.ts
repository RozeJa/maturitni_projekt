import City, { defaultCity } from "./City";
import Hall from "./Hall";

interface Cinema {
    id: string | null,
    city: City,
    street: string,
    houseNumber: string,
    halls: { [key: string]: Hall }
}

export default Cinema

export let defaultCinema: Cinema = {
    id: null,
    city: defaultCity,
    street: '',
    houseNumber: '',
    halls: {}
}