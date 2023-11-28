import { useEffect, useState } from 'react'
import { useRef } from 'react';
import './SmartInput.css'

const SmartInput = ({
        label,
        name,
        type,
        value,
        onChange, 
        disabled = false
    } : {
        label: string,
        name: string,
        type: string,
        value: any,
        onChange: (e:any) => void
        disabled? : boolean
    }) => {
        
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [bigLabel, setBigLabel] = useState(value === '') 

    useEffect(() => {
        setBigLabel(value === '')
    }, [value])

    return (
        <div
            className={bigLabel ? "smart-input-big-label" : 'smart-input'}
            onClick={() => {
                setBigLabel(false)
                if (inputRef.current !== null && 'focus' in inputRef.current) 
                    inputRef.current.focus()
            }}
            >
            <label>{label}</label>
            <input 
                name={name} 
                type={type} 
                value={value} 
                onChange={onChange} 
                disabled={disabled}
                onFocus={() => setBigLabel(false)} 
                onBlur={() => setBigLabel(value === '')} 
                ref={inputRef}
                />
        </div>
    )
}

export default SmartInput