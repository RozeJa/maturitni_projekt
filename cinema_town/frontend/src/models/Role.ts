import Permission from "./Permission";

interface Role {
    id: string,
    name: string,
    permissions: Map<string, Permission> | null
}

export default Role

export let defaultRole: Role = {
    id: '',
    name: '',
    permissions: null
}