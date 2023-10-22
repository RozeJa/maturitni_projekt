import Role, { defaultRole } from "./Role"

interface User {
    id: string | null,
    email: string,
    password: string,
    active: boolean,
    subscriber: boolean,
    role: Role,
    trustedDevicesId: Set<string> | null
}
export default User

export let defaultUser: User = {
    id: null,
    email: '',
    password: '',
    active: false,
    subscriber: false,
    role: defaultRole,
    trustedDevicesId: null
}