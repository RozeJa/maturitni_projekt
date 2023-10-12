import Seat from "./Seat"

interface Hall {
    id: String,
    designation: String,
    rows: number,
    columns: number,
    seats: Seat[] | string[]
}

export default Hall