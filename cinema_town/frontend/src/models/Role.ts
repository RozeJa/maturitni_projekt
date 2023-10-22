import Permission from "./Permission";

interface Role {
    id: string | null,
    name: string,
    permissions: Map<string, Permission> | null
}

export default Role

export let defaultRole: Role = {
    id: null,
    name: '',
    permissions: null
}