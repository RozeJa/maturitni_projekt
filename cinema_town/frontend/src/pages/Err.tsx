import './Err.css'

const Err = ({err = "404", message = "Soubor nenalezen"}) => {
    return (
        <div className='error'>
            <h1>{err}</h1>
            <p>{message}</p>
        </div>
    )
}

export default Err