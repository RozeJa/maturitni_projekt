import { useState } from 'react'
import './SendCode.css'
import { activateAccount, login, reactivateCode, secondVerify } from '../../global_functions/ServerAPI'
import { getLocalStorageItem, getSessionStorageItem } from '../../global_functions/storagesActions'
import { useNavigate } from 'react-router-dom'

const SendCode = (data:any) => {
    
    const [codeErr, setCodeErr] = useState('')
    const [code, setCode] = useState('')

    const [isTrustedDevice, setTrustedDevice] = useState(false)
    const [isActivated, setActivated] = useState(false)
    const [tdForm, setTDForm] = useState(
        <div className='register-form'>
            <h2>Chcete důvěřovat tomuto zařízení</h2>

            <div className="register-form-confirm">
                <button onClick={() =>{
                    setTrustedDevice(false)
                    setTDForm(<></>)
                    setActivated(true)
                }}>Nedůvěřovat</button>  
                <button onClick={() => {
                    setTrustedDevice(true) 
                    setTDForm(<></>)     
                    setActivated(true) 
                }}>Důvěřovat</button>
            </div>
        </div>
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
                const loginToken = await login(getSessionStorageItem("email"), data.password, trutToken)
        
                if (typeof loginToken === 'string') {
                    sessionStorage.setItem("loginToken", loginToken)
                    
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
            const tokenDeviceId = await secondVerify(code)

            const trustedTokensString = getLocalStorageItem("trustedTokens")
            const trustedTokens = JSON.parse(trustedTokensString === '' ? '{}' : trustedTokensString)

            trustedTokens[getSessionStorageItem("email")] = tokenDeviceId.trustToken
            localStorage.setItem("trustedTokens", JSON.stringify(trustedTokens)) 

            sessionStorage.setItem("loginToken", tokenDeviceId.loginToken);


            window.location.href = '/'
        } catch (error) {
            console.log(error)
        
            setCodeErr(data.err)
        } 
    }
    
    return (
        <>
            {tdForm}
            <div className='code-form' style={{display: (isActivated ? "flex" : "none")}}>
                
                <label>{data.label}:</label>
                <input type="text" name='code' onChange={(e: any) => {
                    
                    const { name, value } = e.target                

                    setCode(value)
                }}/>
                <p>{codeErr}</p>

                <div className="code-form-confirm">
                    <button onClick={sendRequest}>{data.submit}</button>
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