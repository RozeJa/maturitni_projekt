interface People {
    id: string,
    name: string,
    surname: string
}
export default People

export let defaultPeople: People = {
    id: '',
    name: '',
    surname: ''
}