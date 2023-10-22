interface People {
    id: string | null,
    name: string,
    surname: string
}
export default People

export let defaultPeople: People = {
    id: null,
    name: '',
    surname: ''
}