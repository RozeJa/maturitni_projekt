import Role from "./Role"

interface User {
    id: string,
    email: string,
    password: string,
    active: boolean,
    subscribed: boolean,
    role: Role | string,
    trustedDevicesId: Map<string, string>
}
export default User

export let defaultUser: User = {
    id: '',
    email: '',
    password: '',
    active: false,
    subscribed: false,
    role: '',
    trustedDevicesId: new Map()
}