import Projection from "./Projection";
import Seat from "./Seat";
import User from "./User";

interface Reservtion {
    id: string,
    projection: Projection,
    user: User,
    seat: Seat,
    paid: boolean,
    reserved: Date
}

export default Reservtion