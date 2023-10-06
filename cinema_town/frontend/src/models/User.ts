import Role from "./Role"

interface User {
    id: string,
    email: string,
    password: string,
    active: boolean,
    subscribed: boolean,
    role: Role,
    trustedDevicesId: Map<string, string>
}
export default User