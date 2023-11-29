import { useState } from 'react'
import './Trailer.css'

const Trailer = ({
        url,
        onClick
    } : {
        url: string | null,
        onClick: Function
    }) => {

    const [closeText, setCloseText] = useState('x')

    return (
            <div className='trailer'>
                <p
                    onClick={() => onClick()}
                    onMouseEnter={() => setCloseText('x')}
                    onMouseLeave={() => setCloseText('')}>{closeText}</p>
                <iframe 
                src={`https://www.youtube.com/embed/${url}?autoplay=1&amp;hd=1&amp;wmode=transparent&amp;rel=0&amp;controls=1&amp;showinfo=0`} 
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                onMouseEnter={() => setCloseText('x')}
                onMouseLeave={() => setCloseText('')}></iframe>
            </div>
        )
    }

export default Trailer