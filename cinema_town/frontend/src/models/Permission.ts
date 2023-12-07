import Entity from "./Entity"

interface Permission extends Entity {
    permission: string
}

export default Permission

export let defaultPermission: Permission = {
    id: null,
    permission: ''
}