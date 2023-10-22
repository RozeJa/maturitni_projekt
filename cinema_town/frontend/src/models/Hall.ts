import Seat from "./Seat"

interface Hall {
    id: string | null,
    designation: string,
    rows: number,
    columns: number,
    seats: Seat[][] | null
}

export default Hall

export let defaultHall: Hall = {
    id: null,
    designation: '',
    rows: 10,
    columns: 15,
    seats: null
}