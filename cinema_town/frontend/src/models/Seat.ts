interface Seat {
    id: string,
    rowDesignation: string,
    number: number,
    rowIndex: number,
    columnIndex: number
}

export default Seat

export let defaultSeat: Seat = {
    id: '',
    rowDesignation: '',
    number: 0,
    rowIndex: 0,
    columnIndex: 0
}