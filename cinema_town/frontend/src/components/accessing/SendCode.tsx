import { useState } from 'react'
import './SendCode.css'
import { activateAccount, login, reactivateCode, secondVerify } from '../../global_functions/ServerAPI'
import { getSessionStorageItem } from '../../global_functions/storagesActions'
import { useNavigate } from 'react-router-dom'

const SendCode = (data:any) => {
    
    const [codeErr, setCodeErr] = useState('')
    const [code, setCode] = useState('')
    
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
            const deviceId = await activateAccount(code)
            localStorage.setItem("deviceID", deviceId)
            try {
                const loginToken = await login(getSessionStorageItem("email"), data.password, deviceId)
        
                if (typeof loginToken === 'string') {
                    sessionStorage.setItem("loginToken", loginToken)
                    navigate('/')
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
            localStorage.setItem("deviceID", tokenDeviceId.deviceId)
            sessionStorage.setItem("loginToken", tokenDeviceId.loginToken);
            
            window.location.href = '/'
        } catch (error) {
        
            console.log(error)
        
            setCodeErr(data.err)
        } 
    }
    
    return (
        <div className='register-form'>
            
            <label>{data.label}:</label>
            <input type="text" name='code' onChange={(e: any) => {
                
                const { name, value } = e.target                

                setCode(value)
            }}/>
            <p>{codeErr}</p>

            <div className="register-form-confirm">
                <button onClick={sendRequest}>{data.submit}</button>
                <p onClick ={() => {
                    if (data.register)
                        reactivateCode(getSessionStorageItem('email'))
                    else 
                        login(getSessionStorageItem("email"), data.password, "")
                } }>Odeslat kód znovu?</p>   
            </div>
        </div>
    )
}


export default SendCode