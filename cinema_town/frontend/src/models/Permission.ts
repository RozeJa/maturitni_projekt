interface Permission {
    id: string | null,
    permission: string
}

export default Permission

export let defaultPermission: Permission = {
    id: null,
    permission: ''
}