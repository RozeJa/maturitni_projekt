import { useState } from 'react'
import './SendCode.css'
import { activateAccount, login, reactivateCode, secondVerify } from '../../global_functions/ServerAPI'
import { getLocalStorageItem, getSessionStorageItem } from '../../global_functions/storagesActions'
import { useNavigate } from 'react-router-dom'
import DeviceTrust from './DeviceTrust'
import { callbackOnEnter } from '../../global_functions/constantsAndFunction'

const SendCode = (data:any) => {
    
    const [codeErr, setCodeErr] = useState('')
    const [code, setCode] = useState('')

    const [isTrustedDevice, setTrustedDevice] = useState(false)
    const [isActivated, setActivated] = useState(false)
    const [tdForm, setTDForm] = useState(
        <DeviceTrust 
            setTrustedDevice={(trust: boolean) => setTrustedDevice(trust)}
            setTDForm={() => setTDForm(<></>)} 
            setActivated={() => setActivated(true)} />
    )
    
    const navigate = useNavigate()
    
    const sendRequest = () => {
        if (data.register) {
            handleRegister()
        } else {
            handleLogin()
        }
    }
    
    const handleRegister = async () => {
        try {

            const trustedTokensString = getLocalStorageItem("trustedTokens")
            const trustedTokens = JSON.parse(trustedTokensString === '' ? '{}' : trustedTokensString)

            const trutToken = await activateAccount(code)
            
            if (isTrustedDevice) {
                trustedTokens[getSessionStorageItem("email")] = trutToken
                localStorage.setItem("trustedTokens", JSON.stringify(trustedTokens)) 
            } 
            
            try {
                const tokens = await login(getSessionStorageItem("email"), data.password, trutToken)
        
                if (typeof tokens?.loginToken === 'string') {
                    sessionStorage.setItem("loginToken", tokens.loginToken)
                    
                    window.location.href = '/'
                } else {
                    throw new Error()
                }
            } catch (error) {
        
                console.log(error)
        
                navigate('/login')
            }
        } catch (error) {
        
            console.log(error)
        
            setCodeErr(data.err)
        } 
    }  

    const handleLogin = async () => {
        try {
            const trustedTokensString = getLocalStorageItem("trustedTokens")
            const trustedTokens = JSON.parse(trustedTokensString === '' ? '{}' : trustedTokensString)

            const tokenDeviceId = await secondVerify(code)

            trustedTokens[getSessionStorageItem("email")] = tokenDeviceId.trustToken
            localStorage.setItem("trustedTokens", JSON.stringify(trustedTokens)) 

            sessionStorage.setItem("loginToken", tokenDeviceId.loginToken);


            window.location.href = '/'
        } catch (error) {
            console.log(error)
        
            setCodeErr(data.err)
        } 
    }

    let email = getSessionStorageItem("email").split("@")
    
    return (
        <>
            {tdForm}
            <div className='code-form' 
                style={{display: (isActivated ? "flex" : "none")}}
                onKeyDown={(event: any) => callbackOnEnter(event, sendRequest)}>
                
                <label>{data.label} {data.register ? email[0].substring(0,2) + "..." + email[0].substring(email[0].length - 2, email[0].length) + "@" + email[1]: ''}</label>
                <input type="text" name='code' onChange={(e: any) => {
                    
                    const { name, value } = e.target                

                    setCode(value)
                }}/>
                <p>{codeErr}</p>

                <div className="code-form-confirm">
                    <button onClick={sendRequest}
                        >{data.submit}</button>
                    <p onClick ={() => {
                        try {
                            if (data.register)
                                reactivateCode(getSessionStorageItem('email'))
                            else 
                                login(getSessionStorageItem("email"), data.password, "{}")
                        } catch (err) {
                        
                        }
                    } }>Odeslat kód znovu?</p>   
                </div>
            </div>
        </>
    )
}


export default SendCode