import { useEffect, useState } from 'react'
import SmartInput from '../../components/SmartInput'
import readTokenProperty from '../../global_functions/readTokenProperty'
import './PwChange.css'
import User, { defaultUser } from '../../models/User'
import { pwRegex } from '../../global_functions/constantsAndFunction'
import { changePw } from '../../global_functions/ServerAPI'
import { useNavigate } from 'react-router-dom'

const defUser: User = defaultUser

const PwChange = () => {

    const [userID, setUserID] = useState("")
    const [user, setUser] = useState({...defUser})

    const [newPassword, setNewPassword] = useState("")
    const [newPasswordAgain, setNewPasswordAgain] = useState("")

    const [authErr, setAuthErr] = useState(false)
    const [requirementshErr, setRequirementshErr] = useState(false)
    const [notSameErr, setNotSameErr] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        setUserID(readTokenProperty("sub"))
    }, [])

    useEffect(() => {
        setUser({...user, ["id"]: userID})
    }, [userID])

    const handleChange = () => {
        if (newPassword === newPasswordAgain) {
            if (pwRegex.test(newPassword)) {
                const changedUser = {...user, ["password2"] : newPassword}
    
                changePw(changedUser)
                    .then(success => {
                        if (success) {
                            navigate(`/my-reservation/${userID}`)
                        } else {
                            // spatne heslo
                            setAuthErr(true)
                        }
                    }).catch(err => {
                        // spatne heslo
                        setAuthErr(true)
                    })
            } else {
                // nesplnuji bezp podminky 
                setRequirementshErr(true)
            }
        } else {
            // hesla se neshoduj9
            setNotSameErr(true)
        }
    }

    return (
        <div className='pw-change'>
            <SmartInput label='Stávající heslo'>
                <input 
                    type='password' 
                    name='curent-password' 
                    value={user.password}
                    onChange={(e: any) => {
                        const { name, value } = e.target

                        setUser({...user, ["password"]: value})
                    }} />
            </SmartInput>
            { authErr ? <p className='pw-change-err'>Nesprávné heslo</p> : <></> }
            <SmartInput label='Nové heslo'>
                <input 
                    type='password' 
                    name='new-password' 
                    value={newPassword} 
                    onChange={(e: any) => {
                        const { value } = e.target 

                        setNewPassword(value)
                    }}/>
            </SmartInput>
            { requirementshErr ? <p className='pw-change-err'>Nové heslo nesplňuje požadavky (Alespoň 12 znaků, velký a malý znak a číslice jsou požadovány)</p> : <></> }
            <SmartInput label='Nové heslo znovu'>
                <input 
                    type='password' 
                    name='new-password-again' 
                    value={newPasswordAgain} 
                    onChange={(e: any) => {
                        const { value } = e.target;

                        setNewPasswordAgain(value)
                    }}/>
            </SmartInput>
            { notSameErr ? <p className='pw-change-err'>Hesla se neshodují</p> : <></> }
            
            <div className="pw-change-btns">
                <a href={`/my-reservation/${userID}`}>Zpět</a>
                <button onChange={handleChange}>Změnit</button>
            </div>
        </div>

    )
}


export default PwChange