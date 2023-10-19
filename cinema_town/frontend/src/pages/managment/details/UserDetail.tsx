import { useEffect, useState } from 'react';
import { emailRegex, pwRegex } from '../../../global_functions/constants'
import User from '../../../models/User'
import './UserDetail.css'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI';
import Role, { defaultRole } from '../../../models/Role';
import DialogErr from '../../../components/DialogErr';


export const validateUser = (data: User): Array<string> => {
    let errs: Array<string> = []

    if (!emailRegex.test(data.email)) {
        errs.push('Email se nezdá být validní.')
    }
    if (!pwRegex.test(data.password)) {
        errs.push('Heslo neodpovídá heslové politice.')
    }

    if (typeof data.role === 'string') {
        if (data.role !== '') {
            let role: Role = defaultRole
            role.id = data.role
            data.role = role
        } else {
            errs.push("Role musí být vyplněná")
        }
    } else if (data.role.id === '') {
        errs.push("Role musí být vyplněná")
    }

    return errs
}

const UserDetail = ({
        data, 
        handleInputText, 
        handleInputCheckbox, 
        setData, 
        setErr
    }: {
        data: User, 
        handleInputText: Function, 
        handleInputCheckbox: Function, 
        setData: Function, 
        setErr: Function
    }) => {

    const [roles, setRoles] = useState([<></>])


    useEffect(() => {
        loadRoles()
    }, [])

    const loadRoles = async () => {
        try {
            let roles = (await loadData<Role>(ModesEndpoints.Role))


            roles.unshift(defaultRole)
                
            setRoles(roles.map((r) => {
                         
                return <option key={r.id} value={r.id}>
                    {r.name}
                </option>
            }))     
        } catch (error) {
            setErr(<DialogErr err='Přístup odepřen' description={"Nemáte dostatečné oprávnění pro načtení rolí"} dialogSetter={setErr} okText={<a href='/management/users/'>Ok</a>} />)
        }
    }
    
    const handleSelect = (e: any) => {
            
        const { name, value } = e.target

        let role: Role = defaultRole
        role.id = value

        setData({ ...data, [name]: role})
    }
    
    return (
        <>
            <label>Email</label>
            <input name='email' type="text" value={data.email} placeholder='email' onChange={(e: any) => handleInputText(e)} />
            <label>Heslo</label>
            <input name='password' type="password" placeholder='password' onChange={(e: any) => handleInputText(e)} />
            <div className="chechbox">
                <label>Odběratel</label>
                <input name='subscriber' type="checkbox" checked={data.subscriber} onChange={(e: any) => handleInputCheckbox(e)} />
            </div>
            <div className="select">
                <label>Role</label>
                <select name="role" value={typeof data.role === 'string' ? data.role : data.role.id} onChange={handleSelect}>
                    { roles }
                </select>
            </div>
        </>
    )
}

export default UserDetail