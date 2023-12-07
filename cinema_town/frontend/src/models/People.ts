import Entity from "./Entity"

interface People extends Entity {
    name: string,
    surname: string
}
export default People

export let defaultPeople: People = {
    id: null,
    name: '',
    surname: ''
}