import Entity from "./Entity"

interface Genre extends Entity {
    name: string
}

export default Genre

export let defaultGerne: Genre = {
    id: null,
    name: ''
}