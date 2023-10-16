import City from "./City";
import Hall from "./Hall";

interface Cinema {
    id: string,
    city: City | string,
    street: string,
    houseNumber: string,
    halls: Hall[] | string[]
}

export default Cinema

export let defaultCinema: Cinema = {
    id: '',
    city: '',
    street: '',
    houseNumber: '',
    halls: []
}