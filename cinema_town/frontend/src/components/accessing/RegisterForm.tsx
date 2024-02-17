import { useState } from 'react'
import './RegisterForm.css'
import User, { defaultUser } from '../../models/User'
import { register } from '../../global_functions/ServerAPI'
import { getSessionStorageItem } from '../../global_functions/storagesActions'
import { callbackOnEnter, emailRegex, pwRegex } from '../../global_functions/constantsAndFunction'
import DialogErr from '../DialogErr'

let user: User = defaultUser
let passwordAgain: string

const setValue = (e: any) => {

    const { name, value } = e.target

    user = { ...user, [name]: value}
} 

const RegisterForm = ({ onSuccess }: { onSuccess: Function }) => {
        
    const [emailErr, setEmailErr] = useState('')
    const [pwErr, setPwErr] = useState('') 
    const [pwAgErr, setPwAgErr] = useState('')

    const [err, setErr] = useState(<></>)

    const validate = (user: User): boolean => {
        let isUserValid = true

        if (!emailRegex.test(user.email)) {
            setEmailErr('Email není validní.')
            isUserValid = false
        } else {
            setEmailErr('')
        }

        if (!pwRegex.test(user.password)) {
            setPwErr('Heslo není dostatečně silné. (Alespoň 12 znaků, velký a malý znak a číslice jsou požadovány)')
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
            try {
                const requestSuccess = await register(user)
                if (requestSuccess) {
    
                    sessionStorage.setItem('email', user.email)
                    onSuccess(user.password)
                }
            } catch (error) {
                setErr(<DialogErr 
                    err="Registrace se nezdařila"
                    description="Je nám líto ale registrace se nezdařila, zkuste použít jiný email, je možné, že tento je už zabraný." 
                    dialogSetter={() => setErr(<></>)} 
                    okText={"Zkusit znovu"} />)
            }
        }
    }

    return (        
        <>
            {err}
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
                    <button 
                        onClick={sendRequest}
                        onKeyDown={(event: any) => callbackOnEnter(event, sendRequest)}>Registrovat</button>
                    <p onClick={() => {

                        if (user.email === '' && getSessionStorageItem('email') === '') {
                            setEmailErr("Vyplňte email pro zadání aktivačního kódu")
                        } else {
                            if (user.email !== '') {
                                sessionStorage.setItem('email', user.email)
                            }

                            onSuccess()                            
                        }
                    }}>Aktivovat účet</p>
                </div>
            </div>
        </>
    )
}

export default RegisterForm