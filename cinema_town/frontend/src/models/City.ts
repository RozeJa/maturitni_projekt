interface City {
    id: string | null,
    name: string
}

export default City

export let defaultCity: City = {
    id: null,
    name: ''
}