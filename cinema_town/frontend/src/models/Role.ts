import Permission from "./Permission";

interface Role {
    id: string,
    name: string,
    permissions: Permission[] | string[]
}

export default Role