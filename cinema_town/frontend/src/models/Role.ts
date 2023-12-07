import Entity from "./Entity";
import Permission from "./Permission";

interface Role extends Entity {
    name: string,
    permissions: Map<string, Permission> | null
}

export default Role

export let defaultRole: Role = {
    id: null,
    name: '',
    permissions: null
}