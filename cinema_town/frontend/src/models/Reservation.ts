import Projection from "./Projection";
import Seat from "./Seat";
import User from "./User";

interface Reservation {
    id: string,
    projection: Projection | string,
    user: User | string,
    seat: Seat | string,
    paid: boolean,
    reserved: Date
}

export default Reservation

export let defaultReservation: Reservation = {
    id: '',
    projection: '',
    user: '',
    seat: '',
    paid: false,
    reserved: new Date()
}