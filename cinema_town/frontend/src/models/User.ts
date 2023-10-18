import Role from "./Role"

interface User {
    id: string,
    email: string,
    password: string,
    active: boolean,
    subscriber: boolean,
    role: Role | string,
    trustedDevicesId: Set<string> | null
}
export default User

export let defaultUser: User = {
    id: '',
    email: '',
    password: '',
    active: false,
    subscriber: false,
    role: '',
    trustedDevicesId: null
}