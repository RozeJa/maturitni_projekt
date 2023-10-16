import Seat from "./Seat"

interface Hall {
    id: string,
    designation: string,
    rows: number,
    columns: number,
    seats: Seat[] | string[]
}

export default Hall

export let defaultHall: Hall = {
    id: '',
    designation: '',
    rows: 0,
    columns: 0,
    seats: []
}