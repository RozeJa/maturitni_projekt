import { useState } from 'react'
import { defaultUser } from '../../models/User'
import './LoginForm.css'
import { login } from '../../global_functions/ServerAPI'
import { getLocalStorageItem } from '../../global_functions/storagesActions'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { callbackOnEnter, emailRegex, pwRegex } from '../../global_functions/constantsAndFunction'

const LoginForm = ({ onSuccess, isNotActive }: { onSuccess: Function, isNotActive: Function }) => {
    
    const [user, setUser] = useState({...defaultUser})

    const setValue = (e: any) => {

        const { name, value } = e.target

        setUser({ ...user, [name]: value})
    } 

    const [emailErr, setEmailErr] = useState('')
    const [pwErr, setPwErr] = useState('') 
    
    const navigate = useNavigate()

    const sendRequest = async () => {
        const trustedTokensString = getLocalStorageItem("trustedTokens")
        const trustedTokens = JSON.parse(trustedTokensString === '' ? '{}' : trustedTokensString)
        
        try {
            const trustToken = trustedTokens[user.email] !== undefined ? trustedTokens[user.email] : ''

            const token = await login(user.email, user.password, trustToken)
            
            if (token !== null) {
                sessionStorage.setItem('loginToken', token.loginToken)
                trustedTokens[user.email] = token.trustToken
                localStorage.setItem("trustedTokens", JSON.stringify(trustedTokens)) 

                window.location.href = '/'
            } else {
                delete trustedTokens[user.email]
                
                localStorage.setItem("trustedTokens", JSON.stringify(trustedTokens)) 

                sessionStorage.setItem('email', user.email)
                onSuccess(user.password)
            }
            setEmailErr('')
            setPwErr('')
        } catch (error) {
            console.log(error)
            
            if (error instanceof AxiosError && error.response?.status === 400) {
                sessionStorage.setItem('email', user.email)
                isNotActive(user.password)
                console.log("asda");
                
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
                    Buď o krok před ostatními a přihlaš se k odběru novinek. Dozvíš se o nových filmech jako první.
                </h1>
            </div>
            <div className='login-form'
                onKeyDown={(event: any) => callbackOnEnter(event, sendRequest)}>
                <label>Email</label>
                <input name='email' type="email" placeholder='email@email.com' onChange={setValue} />
                <p>{emailErr}</p>
                
                
                <label>Heslo</label>
                <input name='password' type="password" placeholder='heslo' onChange={setValue}/>
                <p>{pwErr}</p>
            
                <div className="login-form-confirm">
                    <button onClick={sendRequest}>Přihlásit se</button>
                    <p onClick={() => navigate("/pw-reset")}>Zapomenuté heslo?</p>
                </div>
            </div>
        </>
    )
}

export default LoginForm