interface Permission {
    id: string,
    permission: string
}

export default Permission

export let defaultPermission: Permission = {
    id: '',
    permission: ''
}