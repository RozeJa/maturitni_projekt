import { useEffect, useState } from 'react'
import Film from '../../models/Film'
import './TicketReservation.css'
import Cinema, { defaultCinema } from '../../models/Cinema'
import Projection, { defaultProjection } from '../../models/Projection'
import { ModesEndpoints, loadData } from '../../global_functions/ServerAPI'
import { handleErrRedirect } from '../../global_functions/constantsAndFunction'
import Reservation from '../../models/Reservation'
import Seat from '../../models/Seat'

type SeparedProjections = { [key: string]: Projection[] }

const defSeparedProjections: SeparedProjections = {}

const defCinemas: Cinema[] = []
const defProjections: Projection[] = []
const defReservations: Reservation[] = []
const defSeatsField: Seat[][] = []

const defCinema: Cinema = defaultCinema
const defProjection: Projection = defaultProjection

const TicketReservation = ({
    setTicketReservation,
    film,
    setErr
}: {
    setTicketReservation: Function,
    film: Film,
    setErr: Function
}) => {

    const [cinemas, setCinemas] = useState([...defCinemas])
    const [projections, setProjections] = useState([...defProjections])
    const [reservations, setReservations] = useState([...defReservations])

    const [selectedCinema, setSelectedCinema] = useState({ ...defCinema })
    const [selectedProjection, setSelectedProjection] = useState({ ...defProjection })
    const [projectionsByDabTit, setProjectionsByDatTit] = useState({ ...defSeparedProjections })

    const [seatsField, setSeatsFiel] = useState([...defSeatsField])

    useEffect(() => {
        loadData<Projection>(ModesEndpoints.ProjectionByFilm, [film.id ? film.id : ""])
            .then(data => setProjections([...data]))
            .catch(err => handleErrRedirect(setErr, err))
    }, [])

    useEffect(() => {
        loadData<Cinema>(ModesEndpoints.Cinama)
            .then(data => data.filter(c =>
                Object.values(c.halls).find(h =>
                    projections.find(p =>
                        p.hall.id === h.id) !== undefined) !== undefined))
            .then(data => {
                data.unshift({ ...defaultCinema })
                return data
            })
            .then(data => setCinemas(data))
            .catch(err => handleErrRedirect(setErr, err))
    }, [projections])

    useEffect(() => {
        const projectionsByDabTit: { [key: string]: Projection[] } = {}

        projections.filter(p => Object.values(selectedCinema.halls).find(h => h.id === p.hall.id) !== undefined)
            .forEach(p => {
                const index = `${p.dabing};${p.title}`
                if (projectionsByDabTit[index] === undefined)
                    projectionsByDabTit[index] = [p]
                else {
                    projectionsByDabTit[index].push(p)
                }
            })

        setProjectionsByDatTit(projectionsByDabTit)
    }, [selectedCinema])

    useEffect(() => {

        if (selectedProjection.id !== null) {
            // načti si rezervace pro konkrétní promítání 
            loadData<Reservation>(ModesEndpoints.ReservationCensured, [selectedProjection.id])
                .then(data => setReservations([...data]))
        }
    }, [selectedProjection])

    useEffect(() => {
        const field: Seat[][] = []

        // TODO vygenerovat 2D pole  
    }, [reservations])

    return (
        <div className='ticket-reservation-dialog'>
            <div className='ticket-reservation'>
                <div className="">
                    <h1>{film.name}</h1>
                    <div>
                        <label>Vyberte kino:</label>
                        <select name="selectedCinema"
                            onChange={(e: any) => {
                                const { value } = e.target

                                const cinema = cinemas.find(c => c.id === value)

                                if (cinema !== undefined)
                                    setSelectedCinema({ ...cinema })
                                else
                                    setSelectedCinema({ ...defCinema })
                            }}>
                            {cinemas
                                .map((c, index) =>
                                    <option key={index} value={c.id ? c.id : ''}>
                                        {`${c.city.name}, ${c.street}, ${c.houseNumber}`}
                                    </option>
                                )}
                        </select>
                    </div>
                </div>
                {Object.keys(projectionsByDabTit).map(index => {
                    const dab = index.split(';')[0]
                    let tit = ''
                    if (index.split(';').length === 2) {
                        tit = index.split(';')[1]
                    }

                    const projections = projectionsByDabTit[index].map((p, index) => {
                        const date = p.dateTime
                        let dateToShow: string = ''
                        if (Array.isArray(date)) {
                            console.log(date[3]);

                            dateToShow = `${date[1]}. ${date[2]}. ${date[3].toString().padStart(2, "0")}:${date[4].toString().padStart(2, "0")}`
                        }
                        return <div key={index}
                            onClick={() => {
                                setSelectedProjection({ ...p })
                            }}>
                            {dateToShow}
                        </div>
                    })

                    return <div key={index}>
                        <h3>{`${dab} ${tit !== "" ? "(Tit: " + tit + ")" : ''}`}</h3>
                        {projections}
                    </div>
                })}
                { /**TODO předělat není to komponenta, jsou to data */
                    seatsField}

                <div className="ticket-reservation-btns">
                    <button onClick={() => setTicketReservation(<></>)}>Zrušit</button>
                    <button>Dokončit</button>
                </div>
            </div>
        </div>
    )
}

export default TicketReservation