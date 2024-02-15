import { useEffect, useState } from 'react'
import SmartInput from '../../components/SmartInput'
import './PwReset.css'
import User, { defaultUser } from '../../models/User'
import { useParams } from 'react-router-dom'
import { pwRegex } from '../../global_functions/constantsAndFunction'
import { resetPw } from '../../global_functions/ServerAPI'
import DeviceTrust from '../../components/accessing/DeviceTrust'
import { getLocalStorageItem } from '../../global_functions/storagesActions'

const defUser: User = defaultUser

const PwReset = () => {

    const { email } = useParams<string>()
    const [user, setUser] = useState({...defUser})

    const [newPassword, setNewPassword] = useState("")
    const [newPasswordAgain, setNewPasswordAgain] = useState("")

    const [authErr, setAuthErr] = useState(false)
    const [requirementshErr, setRequirementshErr] = useState(false)
    const [notSameErr, setNotSameErr] = useState(false)

    const [trustForm, setTrustForm] = useState(<></>)
    const [formViewable, setFormViewable] = useState(true)

    useEffect(() => {
        setUser({...user, ["email"]: email ? email : ""})        
    }, [email])

    const handleChange = () => {
        
        if (newPassword === newPasswordAgain) {
            if (pwRegex.test(newPassword)) {
                const changedUser = {...user, ["password"] : newPassword}
    
                resetPw(changedUser)
                    .then(token => {
                        setFormViewable(false)
                        setTrustForm(
                            <DeviceTrust setActivated={() => {}} setTDForm={() => setTrustForm(<></>)}
                                setTrustedDevice={(trusted: boolean) => {
                                    if (trusted) {
                                        const trustedTokensString = getLocalStorageItem("trustedTokens")
                                        const trustedTokens = JSON.parse(trustedTokensString === '' ? '{}' : trustedTokensString)

                                        trustedTokens[user.email] = token.trustToken
                                        localStorage.setItem("trustedTokens", JSON.stringify(trustedTokens)) 

                                        
                                        window.location.href = '/'
                                    }
                                    sessionStorage.setItem('loginToken', token.loginToken)
                                }}
                            />
                        )
                    }).catch(err => {
                        // spatny obnovovaci kód
                        setAuthErr(true)
                    })
                    setRequirementshErr(false)
            } else {
                // nesplnuji bezp podminky 
                setRequirementshErr(true)
            }
            setNotSameErr(false)
        } else {
            // hesla se neshoduj9
            setNotSameErr(true)
        }
    }

    return (
        <div className='pw-reset'>
            {trustForm}

            <div className={formViewable ? '' : 'pw-reset-none'}>
                <SmartInput label='Obnovovací kód'>
                    <input 
                        type='text' 
                        name='code' 
                        value={user.password2}
                        onChange={(e: any) => {
                            const { value } = e.target

                            setUser({...user, ["password2"]: value})
                        }} />
                </SmartInput>
                { authErr ? <p className='pw-reset-err'>Nesprávný obnovovací kód</p> : <></> }
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
                { requirementshErr ? <p className='pw-reset-err'>Nové heslo nesplňuje požadavky (Alespoň 12 znaků, velký a malý znak a číslice jsou požadovány)</p> : <></> }
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
                { notSameErr ? <p className='pw-reset-err'>Hesla se neshodují</p> : <></> }
                
                <div className="pw-reset-btns">
                    <a href='/login'>Zpět</a>
                    <button onClick={handleChange}>Změnit</button>
                </div>
            </div>
        </div>

    )
}

export default PwReset