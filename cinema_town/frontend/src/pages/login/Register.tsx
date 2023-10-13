import { useState } from 'react'
import './Register.css'
import RegisterForm from '../../components/accessing/RegisterForm'
import SendCode from '../../components/accessing/SendCode'

const Register = () => {

    const firstComponent = <RegisterForm 
        onSuccess={(pw:string) => setContent(<SendCode password={pw} 
        err='Neplatný aktivační kód'
        submit='Aktivovat'
        label='Aktivační kód'
        register={true} />)} />

    const [content, setContent] = useState(firstComponent)

    return (
        <div className='register'>
            { content }
        </div>
    )
}

export default Register