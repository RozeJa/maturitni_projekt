import Entity from "./Entity";
import Projection, { defaultProjection } from "./Projection";
import Seat, { defaultSeat } from "./Seat";
import User, { defaultUser } from "./User";

interface Reservation extends Entity {
    projection: Projection,
    user: User,
    seat: Seat,
    reserved: Date
}

export default Reservation

export let defaultReservation: Reservation = {
    id: null,
    projection: defaultProjection,
    user: defaultUser,
    seat: defaultSeat,
    reserved: new Date()
}