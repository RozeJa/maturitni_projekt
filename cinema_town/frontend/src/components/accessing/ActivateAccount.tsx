import { useState } from 'react'
import './ActivateAccount.css'
import { activateAccount, login, reactivateCode } from '../../global_functions/ServerAPI'
import { getSessionStorageItem } from '../../global_functions/sessionActions'
import { redirect, useNavigate } from 'react-router-dom'

const ActivateAccount = (data:any) => {

    const [codeErr, setCodeErr] = useState('')
    const [code, setCode] = useState('')

    const navigate = useNavigate()

    const sendRequest = async () => {
        try {
            const deviceId = await activateAccount(code)
            localStorage.setItem("deviceID", deviceId)
            try {
                const loginToken = await login(getSessionStorageItem("email"), data.password, deviceId)

                sessionStorage.setItem("loginToken", loginToken)
                navigate('/')
            } catch (error) {
                navigate('/login')
            }
        } catch (error) {
            setCodeErr("Neplatný aktivační kód")
        }
    }

    return (
        <div className='register-form'>
            
            <label>Zadejte aktivační kód:</label>
            <input type="text" name='code' onChange={(e: any) => {
                
                const { name, value } = e.target                

                setCode(value)
            }}/>
            <p>{codeErr}</p>

            <div className="register-form-confirm">
                <button onClick={sendRequest}>Aktivovat</button>
                <p onClick ={() => reactivateCode(getSessionStorageItem('email'))}>Odeslat kód znovu?</p>   
            </div>
        </div>
    )
}

export default ActivateAccount