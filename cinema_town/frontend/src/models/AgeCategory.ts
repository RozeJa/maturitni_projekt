import Entity from "./Entity"

interface AgeCategory extends Entity {
    name: string,
    priceModificator: number
}

export default AgeCategory

export let defaultAgeCategory: AgeCategory = {
    id: null,
    name: "",
    priceModificator: 1
}