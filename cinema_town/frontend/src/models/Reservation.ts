import Projection, { defaultProjection } from "./Projection";
import Seat, { defaultSeat } from "./Seat";
import User, { defaultUser } from "./User";

interface Reservation {
    id: string | null,
    projection: Projection,
    user: User,
    seat: Seat,
    paid: boolean,
    reserved: Date
}

export default Reservation

export let defaultReservation: Reservation = {
    id: null,
    projection: defaultProjection,
    user: defaultUser,
    seat: defaultSeat,
    paid: false,
    reserved: new Date()
}