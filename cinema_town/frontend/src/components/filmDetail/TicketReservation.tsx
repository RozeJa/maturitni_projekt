import { useEffect, useState } from 'react'
import Film from '../../models/Film'
import './TicketReservation.css'
import Cinema, { defaultCinema } from '../../models/Cinema'
import Projection, { defaultProjection } from '../../models/Projection'
import { ModesEndpoints, loadData } from '../../global_functions/ServerAPI'
import { handleErrRedirect } from '../../global_functions/constantsAndFunction'

const defCinemas: Cinema[] = []
const defProjections: Projection[] = []

const defCinema: Cinema = defaultCinema
const defProjection: Projection = defaultProjection

const TicketReservation = ({
        setTicketReservation,
        film,
        setErr
    }:{
        setTicketReservation: Function,
        film: Film,
        setErr: Function
    }) => {

    const [cinemas, setCinemas] = useState([...defCinemas])
    const [projections, setProjections] = useState([...defProjections])

    const [selectedCinema, setSelectedCinema] = useState({...defCinema})
    const [selectedProjection, setSelectedProjection] = useState({...defProjection})
    
    const [seatsField, setSeatsFiel] = useState(<></>)

    useEffect(() => {
        loadData<Projection>(ModesEndpoints.ProjectionByFilm, [film.id ? film.id : ""])
            .then(data => setProjections(data))
            .catch(err => handleErrRedirect(setErr, err))
    }, [])

    useEffect(() => {
        loadData<Cinema>(ModesEndpoints.Cinama)
            .then(data => data.filter(c => 
                Object.values(c.halls).find(h => 
                    projections.find(p => 
                        p.hall.id === h.id) !== undefined) !== undefined))
            .then(data => setCinemas(data))
            .catch(err => handleErrRedirect(setErr, err))
    }, [projections])

    useEffect(() => {

    }, [selectedProjection])

    const hallSelection = <div className="">
        <label>Vyberte sál:</label>
        <select name="selectedHall"
            onChange={(e:any) => console.log(e)}>
            {Object.values(selectedCinema.halls)
                .map(h =>
                <option value={h.id ? h.id : ''}>
                    {`${h.designation}`}
                </option>
            )}
        </select>
    </div>

    return (
        <div className='ticket-reservation-dialog'>
            <div className='ticket-reservation'>
                <div className="">
                    <label>Vyberte kino:</label>
                    <select name="selectedCinema"
                        onChange={(e:any) => console.log(e)}>
                        {cinemas
                            .map(c =>
                            <option value={c.id ? c.id : ''}>
                                {`${c.city.name}, ${c.street}, ${c.houseNumber}`}
                            </option>
                        )}
                    </select>
                </div>
                { selectedCinema.id !== null ? hallSelection : <></> }
                { seatsField }

                <div className="ticket-reservation-btns">
                    <button onClick={() => setTicketReservation(<></>)}>Zrušit</button>
                    <button>Dokončit</button>
                </div>
            </div>
        </div>
    )
}

export default TicketReservation