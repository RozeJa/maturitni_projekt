import { useState } from 'react'
import './Login.css'
import LoginForm from '../../components/accessing/LoginForm'
import SendCode from '../../components/accessing/SendCode'


const Login = () => {
    const firstComponent = <LoginForm 
        onSuccess={(pw:string) => setContent(<SendCode password={pw} 
        err='Neplatný ověřovací kód'
        submit='Ověřit'
        label='Ověřovací kód' />)}
        register={false} />

    const [content, setContent] = useState(firstComponent)

    return (
        <div className='login'>
            { content }
        </div>
    )
}

export default Login