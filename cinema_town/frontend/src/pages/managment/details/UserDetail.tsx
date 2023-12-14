import { useEffect, useState } from 'react';
import { emailRegex, handleErrRedirect, pwRegex } from '../../../global_functions/constantsAndFunction'
import User, { defaultUser } from '../../../models/User'
import './UserDetail.css'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI';
import Role, { defaultRole } from '../../../models/Role';
import SmartInput from '../../../components/SmartInput';
import { storeDetailData } from './Detail';


export const validateUser = (data: User): Array<string> => {
    let errs: Array<string> = []

    if (!emailRegex.test(data.email)) {
        errs.push('Email se nezdá být validní.')
    }
    if (!pwRegex.test(data.password)) {
        errs.push('Heslo neodpovídá heslové politice. (Heslo by mělo alespoň obsahovat malé písmeno, velké písmeno a číslici)')
    }
    if (data.password !== data.password2) {
        errs.push('Hesla se neshodují')
    }

    if (typeof data.role === 'string') {
        if (data.role !== '') {
            let role: Role = defaultRole
            role.id = data.role
            data.role = role
        } else {
            errs.push("Role musí být vyplněná")
        }
    } else if (data.role.id === null) {
        errs.push("Role musí být vyplněná")
    }

    return errs
}

const UserDetail = ({
        data, 
        setErr
    }: {
        data: User, 
        setErr: Function
    }) => {

    
    const [tempData, setTempData] = useState(defaultUser)
    useEffect(() => {
        setTempData(data)
        storeDetailData(tempData)
    }, [data])
    useEffect(() => {
        storeDetailData(tempData)
    }, [tempData])
    
    const [roles, setRoles] = useState([<></>])

    useEffect(() => {
        loadData<Role>(ModesEndpoints.Role)
            .then(data => {
                data.unshift(defaultRole)
                setRoles(data.map((r) => {
                         
                    return <option key={r.id} value={r.id !== null ? r.id : ''}>
                        {r.name}
                    </option>
                }))     
            })
            .catch(err => handleErrRedirect(setErr, err))
    }, [])
    
    const handleSelect = (e: any) => {
            
        const { name, value } = e.target

        let role: Role = defaultRole
        role.id = value

        setTempData({ ...tempData, [name]: role})
    }

    const handleInput = (e: any) => {
        if (tempData.id === null) 
            handleInputText(e)
    }

    const handleInputText = (e:any) => {
        const {name, value} = e.target

        setTempData({... tempData, [name]: value})
    }

    const handleInputCheckbox = (e:any) => {
        const {name, checked} = e.target

        setTempData({... tempData, [name]: checked})
    }
    
    return (
        <>
            <SmartInput label={'Email'}>
                <input 
                    name={'email'}
                    type={'text'}
                    value={tempData.email}
                    onChange={(e: any) => handleInput(e)}
                    disabled={tempData.id !== null} />
            </SmartInput>
            
            <SmartInput label={'Heslo'}>
                <input 
                    name={'password'}
                    type={'password'}
                    value={''}
                    onChange={(e: any) => handleInput(e)}
                    disabled={tempData.id !== null} />
            </SmartInput>
            
            <SmartInput label={'Potvrzení hesla'}>
                <input 
                    name={'password2'}
                    type={'password'}
                    value={''}
                    onChange={(e: any) => handleInput(e)}
                    disabled={tempData.id !== null} />
            </SmartInput>
            
            <div className="chechbox">
                <label>Odběratel</label>
                <input name='subscriber' type="checkbox" checked={tempData.subscriber} onChange={(e: any) => handleInputCheckbox(e)} disabled={tempData.id !== null} />
            </div>
            <div className="select">
                <label>Role</label>
                <select name="role" value={typeof tempData.role === 'string' ? tempData.role : (tempData.role.id !== null ? tempData.role.id : '')} onChange={handleSelect}>
                    { roles }
                </select>
            </div>
        </>
    )
}

export default UserDetail