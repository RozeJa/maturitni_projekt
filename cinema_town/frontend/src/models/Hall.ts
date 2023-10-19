import Seat from "./Seat"

interface Hall {
    id: string,
    designation: string,
    rows: number,
    columns: number,
    seats: Seat[] | null
}

export default Hall

export let defaultHall: Hall = {
    id: '',
    designation: '',
    rows: 0,
    columns: 0,
    seats: null
}