import { useState } from 'react'
import User from '../../models/User'
import './LoginForm.css'
import { login } from '../../global_functions/ServerAPI'
import { getLocalStorageItem } from '../../global_functions/storagesActions'
import { useNavigate } from 'react-router-dom'

let user: User

user = {
    email: '',
    password: '',
    id: '',
    active: false, 
    subscribed: false, 
    trustedDevicesId: new Map,
    role: ''
}

const setValue = (e: any) => {

    const { name, value } = e.target

    user = { ...user, [name]: value}
} 


const LoginForm = (data: any) => {
    
    const [emailErr, setEmailErr] = useState('')
    const [pwErr, setPwErr] = useState('') 

    const navigate = useNavigate()

    const sendRequest = async () => {
        
        const deviceID = getLocalStorageItem('deviceID')
        try {
            const loginToken = await login(user.email, user.password, deviceID)
            if (typeof loginToken === 'string') {
                sessionStorage.setItem('loginToken', loginToken)
                navigate('/')
            } else {
                localStorage.removeItem('deviceID')
                sessionStorage.setItem('email', user.email)
                data.onSuccess(user.password)
            }
            setEmailErr('')
            setPwErr('')
        } catch (error) {
            setEmailErr('Zkontrolujte email')
            setPwErr('Zkontrolujte heslo')
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