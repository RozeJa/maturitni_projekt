import AgeCategory from "./AgeCategory";
import Entity from "./Entity";
import Projection, { defaultProjection } from "./Projection";
import Seat from "./Seat";
import User, { defaultUser } from "./User";

interface Reservation extends Entity {
    projection: Projection,
    user: User,
    seats: Seat[],
    codes: {[key:string]: AgeCategory },
    reserved: Date
}

export default Reservation

export let defaultReservation: Reservation = {
    id: null,
    projection: defaultProjection,
    user: defaultUser,
    seats: [],
    codes: {},
    reserved: new Date()
}