import Entity from "./Entity"

interface Seat extends Entity {
    rowDesignation: string,
    number: number,
    rowIndex: number,
    columnIndex: number,
    seat: boolean
}

export default Seat

export const defaultSeat: Seat = {
    id: null,
    rowDesignation: '',
    number: 0,
    rowIndex: 0,
    columnIndex: 0,
    seat: true
}