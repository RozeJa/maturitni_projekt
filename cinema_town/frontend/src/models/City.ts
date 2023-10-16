interface City {
    id: string,
    name: string,
    postalCode: string
}

export default City

export let defaultCity: City = {
    id: '',
    name: '',
    postalCode: ''
}