import Projection from "./Projection";
import Seat from "./Seat";
import User from "./User";

interface Reservation {
    id: string,
    projection: Projection,
    user: User | string,
    seat: Seat | string,
    paid: boolean,
    reserved: Date
}

export default Reservation