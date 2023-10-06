import City from "./City";
import Hall from "./Hall";

interface Cinema {
    id: String,
    city: City,
    street: String,
    houseNumber: String,
    halls: Hall[]
}

export default Cinema