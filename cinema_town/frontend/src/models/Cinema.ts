import City from "./City";
import Hall from "./Hall";

interface Cinema {
    id: string,
    city: City,
    street: string,
    houseNumber: string,
    halls: Hall[]
}

export default Cinema