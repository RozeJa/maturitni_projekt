import React, { useEffect, useState, useRef, ReactNode } from 'react';
import './BeautifulInput.css';

const BeautifulInput = ({
    label,
    children
}: {
    label: string | null,
    children: ReactNode
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <div
            className='beautiful-input'
        >
            <label>{label}</label>
            {children}
        </div>
    );
};

export default BeautifulInput;
