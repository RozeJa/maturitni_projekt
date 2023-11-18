import Seat from "./Seat"

interface Hall {
    id: string | null,
    designation: string,
    rows: number,
    columns: number,
    seats: { [key: string]: Seat }
}

export default Hall

export let defaultHall: Hall = {
    id: null,
    designation: '',
    rows: 10,
    columns: 15,
    seats: {}
}