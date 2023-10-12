import { useState } from 'react'
import './RegisterFrom.css'
import User from '../../models/User'
import { register } from '../../global_functions/ServerAPI'
import { getSessionStorageItem } from '../../global_functions/storagesActions'
import { emailRegex, pwRegex } from '../../global_functions/constants'

let user: User
let passwordAgain: string

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

const RegisterForm = (data: any) => {
        

    const [emailErr, setEmailErr] = useState('')
    const [pwErr, setPwErr] = useState('') 
    const [pwAgErr, setPwAgErr] = useState('')

    const validate = (user: User): boolean => {
        let isUserValid = true

        if (!emailRegex.test(user.email)) {
            setEmailErr('Email není validní.')
            isUserValid = false
        } else {
            setEmailErr('')
        }

        if (!pwRegex.test(user.password)) {
            setPwErr('Heslo není dostatečně silné. (Alespoň 12 znaků, velký a malí znak a číslice jsou požadovány)')
            isUserValid = false
        } else {
            setPwErr('')
        }

        if (user.password !== passwordAgain) {
            setPwAgErr('Hesla se neshodují')
            isUserValid = false
        } else {
            setPwAgErr('')
        }

        return isUserValid
    }

    const sendRequest = async () => {
        
        if (validate(user)) {
            const requestSuccess = await register(user)
            if (requestSuccess) {

                sessionStorage.setItem('email', user.email)
                data.onSuccess(user.password)
            }
        }
    }

    return (        
        <>
            <div className='register-motivation'>
                <h1>
                    Získej možnost rezervování míst na své oblíbené filmy a nenech si tuto příležitost už nikdy utéct.
                </h1>
                <h2>
                    Registruj se nyní.
                </h2>
            </div>
            <div className='register-form'>
                <label>Email</label>
                <input name='email' type="email" placeholder='email@email.com' onChange={setValue} />
                <p>{emailErr}</p>
                
                
                <label>Heslo</label>
                <input name='password' type="password" placeholder='heslo' onChange={setValue}/>
                <p>{pwErr}</p>
                
                <label>Heslo znovu</label>
                <input type='password' placeholder='heslo' onChange={(e) => {

                    const { name, value } = e.target 

                    passwordAgain = value
                }} />
                <p>{pwAgErr}</p>

                <div className="register-form-confirm">
                    <button onClick={sendRequest}>Registrovat</button>
                    <p onClick={() => {

                        if (user.email === '' && getSessionStorageItem('email') === '') {
                            setEmailErr("Vyplňte email pro zadání aktivačního kódu")
                        } else {
                            if (user.email !== '') {
                                sessionStorage.setItem('email', user.email)
                            }

                            data.onSuccess()                            
                        }
                    }}>Aktivovat účet</p>
                </div>
            </div>
        </>
    )
}

export default RegisterForm