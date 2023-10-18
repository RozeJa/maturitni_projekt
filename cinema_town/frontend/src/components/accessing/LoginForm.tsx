import { useState } from 'react'
import User, { defaultUser } from '../../models/User'
import './LoginForm.css'
import { login } from '../../global_functions/ServerAPI'
import { getLocalStorageItem } from '../../global_functions/storagesActions'
import { AxiosError } from 'axios'

let user: User = defaultUser

const setValue = (e: any) => {

    const { name, value } = e.target

    user = { ...user, [name]: value}
} 

const LoginForm = ({ onSuccess, isNotActive }: { onSuccess: Function, isNotActive: Function }) => {
    
    const [emailErr, setEmailErr] = useState('')
    const [pwErr, setPwErr] = useState('') 

    const sendRequest = async () => {
        
        const deviceID = getLocalStorageItem('deviceID')
        try {
            const loginToken = await login(user.email, user.password, deviceID)
            if (typeof loginToken === 'string') {
                sessionStorage.setItem('loginToken', loginToken)
            
                window.location.href = '/'
            } else {
                localStorage.removeItem('deviceID')
                sessionStorage.setItem('email', user.email)
                onSuccess(user.password)
            }
            setEmailErr('')
            setPwErr('')
        } catch (error) {
            console.log(error)
            
            if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST') {
                sessionStorage.setItem('email', user.email)
                isNotActive(user.password)
            } else {
                setEmailErr('Zkontrolujte email')
                setPwErr('Zkontrolujte heslo')
            }
        }
        
    }

    return (        
        <>
            <div className='login-motivation'>
                <h1>
                    Buď o krok před ostatnímy a přihlas se k odběru noviken. Dozvíš se o nových filmech jako první.
                </h1>
            </div>
            <div className='login-form'>
                <label>Email</label>
                <input name='email' type="email" placeholder='email@email.com' onChange={setValue} />
                <p>{emailErr}</p>
                
                
                <label>Heslo</label>
                <input name='password' type="password" placeholder='heslo' onChange={setValue}/>
                <p>{pwErr}</p>
            
                <div className="login-form-confirm">
                    <button onClick={sendRequest}>Přihlásit se</button>
                </div>
            </div>
        </>
    )
}

export default LoginForm