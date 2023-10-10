import { useState } from 'react'
import './Register.css'
import User from '../../models/User'

let initUser: User
let passwordAgain: string

const errBGColors = {backgroundColor: '#FF0000'}

const Register = () => {

    const [inputStyles, setInputStyles] = useState({})

    const registerForm = (
        <div className='register-form'>
            <label>Email</label>
            <input name='email' style={inputStyles} type="email" placeholder='email@email.com' />
            <label>Heslo</label>
            <input name='password' style={inputStyles} type="password" placeholder='heslo' />
            <label>Heslo znovu</label>
            <input type='password' style={inputStyles} placeholder='heslo' />
            <button>Registrovat</button>
        </div>
    )

    const [content, setContent] = useState(registerForm)

    const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

    return (
        <div className='register'>
            {/** nějaký pěkný obrákzek nebo text */}
            <div className='register-motivation'>
                <h1>
                    Získej možnost rezervování míst na své oblíbené filmy a nenech si tuto příležitost už nikdy utéct.
                </h1>
                <h2>
                    Registruj se nyní.
                </h2>
            </div>
            {/** register form */}
            { content }
        </div>
    )
}

export default Register