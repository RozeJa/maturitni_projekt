import Entity from "./Entity"
import Role, { defaultRole } from "./Role"

interface User extends Entity {
    email: string,
    password: string,
    password2: string,
    active: boolean,
    subscriber: boolean,
    role: Role
}
export default User

export let defaultUser: User = {
    id: null,
    email: '',
    password: '',
    password2: '',
    active: false,
    subscriber: false,
    role: defaultRole
}