import { useState } from 'react'
import './Register.css'
import RegisterForm from '../../components/accessing/RegisterForm'
import ActivateAccount from '../../components/accessing/ActivateAccount'

const Register = () => {

    const firstComponent = sessionStorage.getItem('registred') !== '' ? 
        <RegisterForm onSuccess={(pw:string) => setContent(<ActivateAccount password={pw} />)} /> : 
        <ActivateAccount />

    const [content, setContent] = useState(firstComponent)

    return (
        <div className='register'>
            { content }
        </div>
    )
}

export default Register