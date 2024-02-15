import { useState } from 'react'
import SmartInput from '../../components/SmartInput'
import User, { defaultUser } from '../../models/User'
import './PwResetRequest.css'
import { useNavigate } from 'react-router-dom'
import { resetPwRequest } from '../../global_functions/ServerAPI'

const defUser: User = defaultUser

const PwResetRequest = () => {

    const [user, setUser] = useState({...defUser})
    const [err, setErr] = useState("")

    const navigate = useNavigate()

    const handleChange = () => {
        resetPwRequest(user).then((ok) => {
            if (ok)
                navigate(`/pw-reset/${user.email}`)
            else setErr("V tuto chvíly není možné vyžádat obnovu hesla tohoto účtu. Zkuste to zkusit za nějaký čas, nebo se obraťtě na podporu.")
        })
        .catch(err => setErr("V tuto chvíly není možné vyžádat obnovu hesla tohoto účtu. Zkuste to zkusit za nějaký čas, nebo se obraťtě na podporu."))
    }

    return (
        <div className='pw-reset-request'>
            <SmartInput label='Váš email'>
                <input 
                    type='email' 
                    name='email' 
                    value={user.email}
                    onChange={(e: any) => {
                        const { value } = e.target

                        setUser({...user, ["email"]: value})
                    }} />
            </SmartInput>
            <p className='pw-reset-request-err'>{err}</p>
            <div className="pw-reset-request-btns">
                <a href='/login'>Zpět</a>
                <button onClick={handleChange}>Vyžádat obnovu</button>
            </div>
        </div>
    )
}

export default PwResetRequest