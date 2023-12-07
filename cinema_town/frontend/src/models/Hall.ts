import Entity from "./Entity"
import Seat from "./Seat"

interface Hall extends Entity {
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