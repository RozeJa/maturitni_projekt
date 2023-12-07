import Entity from "./Entity"

interface City extends Entity {
    name: string
}

export default City

export let defaultCity: City = {
    id: null,
    name: ''
}