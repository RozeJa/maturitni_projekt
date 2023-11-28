import { useEffect, useState } from 'react'
import './SmartInput.css'

const SmartInput = ({
        label,
        name,
        type,
        value,
        onChange, 
        disabled = false
    }) => {

    const [bigLabel, setBigLabel] = useState(value === '') 

    useEffect(() => {

    }, [bigLabel])

    return (
        <div>
            <label className={bigLabel ? "big-label" : ''}>{label}</label>
            <input 
                name={name} 
                type={type} 
                value={value} 
                onChange={onChange} 
                disabled={disabled} 
                onFocus={(e) => console.log(e)} 
                onBlur={(e) => console.log(e)}/>
        </div>
    )
}

export default SmartInput