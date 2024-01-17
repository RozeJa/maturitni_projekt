import Entity from "./Entity";
import Projection from "./Projection";
import Seat from "./Seat";

interface ReservationDTO extends Entity {
    projection: Projection,
    seats: Seat[],
    paymentData: { [key: string]: string },
    agesCategories: { [key: string]: number }
}

export default ReservationDTO