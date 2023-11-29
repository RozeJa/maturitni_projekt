import React, { useEffect, useState, useRef, ReactNode } from 'react';
import './SmartInput.css';

const SmartInput = ({
    label,
    children
}: {
    label: string
    children: ReactNode // Změna typu na ReactNode
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [bigLabel, setBigLabel] = useState(
        inputRef.current ? inputRef.current.value === '' : true
    );

    useEffect(() => {
        setBigLabel(inputRef.current ? inputRef.current.value === '' : true);
    }, [children]);

    return (
        <div
            className={bigLabel ? 'smart-input-big-label' : 'smart-input'}
            onClick={() => {
                setBigLabel(false);
                if (inputRef.current !== null && 'focus' in inputRef.current)
                    inputRef.current.focus();
            }}
            onFocus={() => setBigLabel(false)}
            onBlur={() => setBigLabel(inputRef.current ? inputRef.current.value === '' : true)}
        >
            <label>{label}</label>
            {React.cloneElement(children as React.ReactElement, {
                ref: inputRef
            })}
        </div>
    );
};

export default SmartInput;
