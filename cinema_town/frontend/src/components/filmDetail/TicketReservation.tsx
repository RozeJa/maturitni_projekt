import { useEffect, useState } from 'react'
import Film from '../../models/Film'
import './TicketReservation.css'
import Cinema, { defaultCinema } from '../../models/Cinema'
import Projection, { defaultProjection } from '../../models/Projection'
import Hall, { defaultHall } from '../../models/Hall'

const defCinemas: Cinema[] = []
const defProjections: Projection[] = []

const defCinema: Cinema = defaultCinema
const defProjection: Projection = defaultProjection
const defHall: Hall = defaultHall

const TicketReservation = ({
        setTicketReservation,
        film
    }:{
        setTicketReservation: Function,
        film: Film
    }) => {

    const [cinemas, setCinemas] = useState([...defCinemas])
    const [projections, setProjections] = useState([...defProjections])

    const [selectedCinema, setSelectedCinema] = useState({...defCinema})
    const [selectedProjection, setSelectedProjection] = useState({...defProjection})
    const [selectedHall, setSelectedHall] = useState({...defHall})

    useEffect(() => {

    }, [])

    return (
        <div className='ticket-reservation-dialog'>
            <div className='ticket-reservation'>
                <div className="">
                    <label>Vyberte kino:</label>
                    <select name="">
                        {cinemas.map(c =>
                            <option value={c.id ? c.id : ''}>
                                {`${c.city.name}, ${c.street}, ${c.houseNumber}`}
                            </option>
                        )}
                    </select>
                </div>
                <div className="ticket-reservation-btns">
                    <button onClick={() => setTicketReservation(<></>)}>Zrušit</button>
                    <button>Dokončit</button>
                </div>
            </div>
        </div>
    )
}

export default TicketReservation