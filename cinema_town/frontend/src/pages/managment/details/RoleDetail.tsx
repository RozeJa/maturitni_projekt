import { useEffect, useState } from 'react'
import Role from '../../../models/Role'
import './RoleDetail.css'
import DialogErr from '../../../components/DialogErr'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI'
import Permission from '../../../models/Permission'
import { handleErrRedirect } from '../../../global_functions/constantsAndFunction'

export const validateRole = (data: Role): Array<string> => {
    let errs: Array<string> = []

    return errs
}

const RoleDetail = ({
    data, 
    handleInputText, 
    handleInputCheckbox, 
    setData, 
    setErr
}: {
    data: Role, 
    handleInputText: Function, 
    handleInputCheckbox: Function, 
    setData: Function, 
    setErr: Function
}) => {

    const [permisionsData, setPermissionsData] = useState(new Map<string, Permission>())
    const [permisions, setPermissions] = useState([<></>])

    useEffect(() => {
        loadData<Permission>(ModesEndpoints.Permission)
            .then(data => {
                let map = new Map<string, Permission>()
            
                data.sort((a,b) => a.permission.localeCompare(b.permission)).forEach((perm) => {
                    map.set(perm.id !== null ? perm.id : '', perm);
                })
                
                setPermissionsData(map) 
            })
            .catch(err => handleErrRedirect(setErr, err))
    }, [])

    useEffect(() => {
        reprintPermissions()
    }, [permisionsData, data])

    const reprintPermissions = () => {
        let toDisplay: Array<JSX.Element> = []

        permisionsData.forEach((perm, key) => {
                toDisplay.push(
                    <div key={key} className="role-detail-permisions-permission">
                        <p>{perm.permission}</p>
                        <input type="checkbox" name={perm.id !== null ? perm.id : ''} checked={inRole(perm)} onChange={handleCheck} />
                    </div>
                )
            })
        
        setPermissions(toDisplay)
    }

    const inRole = (perm: Permission): boolean => {
        if (data.permissions === null)
            return false

        let badJoke: any = data.permissions
        
        return badJoke[perm.id !== null ? perm.id : ''] !== undefined
    }

    const handleCheck = (event: any) => {
        const { name, checked } = event.target

        let permisions: any = data.permissions
        if (permisions === null)
            permisions = new Map<string, Permission>()


        if (checked) {
            const permission =  permisionsData.get(name)
            if (permission !== undefined) 
                permisions[name] = permission
        } else {
            delete permisions[name]
        }
      
        setData({ ...data, ['permissions']: permisions})
        reprintPermissions()
    }

    return (
        <div className="role-detail-permisions">
            {permisions}
        </div>
    )
}

export default RoleDetail