import Role, { defaultRole } from "./Role"

interface User {
    id: string | null,
    email: string,
    password: string,
    password2: string,
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
    password2: '',
    active: false,
    subscriber: false,
    role: defaultRole,
    trustedDevicesId: null
}