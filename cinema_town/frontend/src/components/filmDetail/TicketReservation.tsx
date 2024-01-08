import { useEffect, useState } from 'react'
import Film from '../../models/Film'
import './TicketReservation.css'
import Cinema, { defaultCinema } from '../../models/Cinema'
import Projection, { defaultProjection } from '../../models/Projection'
import { ModesEndpoints, loadData } from '../../global_functions/ServerAPI'
import { handleErrRedirect } from '../../global_functions/constantsAndFunction'
import Reservation from '../../models/Reservation'
import Seat from '../../models/Seat'
import queryString from 'query-string'

type SeparedProjections = { [key: string]: Projection[] }

const defSeparedProjections: SeparedProjections = {}

const defCinemas: Cinema[] = []
const defProjections: Projection[] = []
const defReservations: Reservation[] = []
const defSeatsField: (Seat|undefined)[][] = []
const defSeats: Seat[] = []

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
    const [selectedSeats, setSelectedSeats] = useState([...defSeats])
   
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
        setSelectedSeats([])
        if (selectedProjection.id !== null) {
            // načti si rezervace pro konkrétní promítání 
            loadData<Reservation>(ModesEndpoints.ReservationCensured, [selectedProjection.id])
                .then(data => setReservations([...data]))
        } else {
            setReservations([...defReservations])
        }
    }, [selectedProjection])

    useEffect(() => {
        const field: (Seat|undefined)[][] = []

        // vygenerovat 2D pole  
        Object.values(selectedProjection.hall.seats)
        .forEach(s => {
            if (field[s.rowIndex] === undefined) 
                field[s.rowIndex] = []

            const reservedSeat = reservations.find(r => r.seats.find(reservedSeat => reservedSeat.id === s.id)) === undefined

            field[s.rowIndex][s.columnIndex] = s.seat ? {...s, ["seat"]: reservedSeat} : undefined
        })

        setSeatsFiel([...field])

    }, [reservations])
 
    useEffect(() => {
        
        const searchParams = window.location.search;
        const { cid } = queryString.parse(searchParams);

        const cinema = cinemas.find(c => c.id == cid)
        if (cinema !== undefined)
            setSelectedCinema(cinema)

    }, [cinemas])

    useEffect(() => {

        const searchParams = window.location.search;
        const { pid } = queryString.parse(searchParams);

        const projection = projections.find(p => p.id == pid) 
        if (projection !== undefined) {
            setSelectedProjection(projection)

            const cinema = cinemas.find(c => Object.values(c.halls).find(h => projection.hall.id === h.id) !== undefined)
            
            if (cinema !== undefined) 
                setSelectedCinema(cinema)
        }

    }, [projections, cinemas])

    return (
        <div className='ticket-reservation-dialog'>
            <div className='ticket-reservation'>
                <div className="header">
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

                                setSelectedProjection({...defProjection})
                            }}>
                            {cinemas
                                .map((c, index) =>
                                    <option key={index} value={c.id ? c.id : ''} selected={selectedCinema.id === c.id}>
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

                    const projections = projectionsByDabTit[index]
                    .map(p => {
                        const date = p.dateTime
                        let dateToShow: string = ''
                        if (Array.isArray(date)) {
                            dateToShow = `${date[1]}. ${date[2]}. ${date[3].toString().padStart(2, "0")}:${date[4].toString().padStart(2, "0")}`
                        }
                        return {
                            'projection': p,
                            'date': dateToShow
                        }
                    })
                    .sort((a,b) => -(a.date.localeCompare(b.date)))
                    .map((p, index) => {
                        return <div key={index} className={selectedProjection.id === p.projection.id ? 'ticket-reservation-selected-projection' : ''}
                            onClick={() => {
                                setSelectedProjection({ ...p.projection })
                            }}>
                            {p.date}
                        </div>
                    })

                    return <div key={index} className='ticket-reservation-film-by-dab'>
                        <h3>{`${dab} ${tit !== "" ? "(Tit: " + tit + ")" : ''}`}</h3>
                        <div>
                            {projections}
                        </div>
                    </div>
                })}

                {/** //TODO přidat pasáž pro navolení počtu lístků a kategorií lístků  
                 * bude zde kategorie nepřiřazené listky, a pak kategorie načtené z backendu
                 * formulář půjde odeslat jeďině pokud bude vybrané alespoň jedno sedadlo a pokud budou všechny lístky přiřazeny
                 * // TODO je třeba nejprve vytvořit interface pro přidávání a zobrazování věkových kategorií
                */}

                
                
                { seatsField.length !== 0 ? <h3><hr />Zde se nachází promítací plátno<hr /></h3> : <></> }
                
                <table>
                    <tbody>
                    { /**TODO předělat není to komponenta, jsou to data */
                        seatsField.map((row,index) => {
                            const rowCells = row.map((seat,index) => {

                                if (seat === undefined) {
                                    return <td key={index}  >
                                    <input 
                                        className='ticket-reservation-non-seat' 
                                        type="checkbox" 
                                        disabled
                                        />
                                </td>
                                }

                                const isReserved = !seat.seat
                                const isSelected = selectedSeats.find(s => s.id === seat.id) !== undefined

                                return <td key={index}>
                                    <input 
                                        className={isReserved ? 'ticket-reservation-unreservable' : isSelected ? 'ticket-reservation-selected' : ''} 
                                        type="checkbox" 
                                        checked={isReserved || isSelected} 
                                        disabled={isReserved} 
                                        onChange={(e:any) => {
                                            if (!isReserved) {
                                                const {checked} = e.target

                                                if (checked) {
                                                    selectedSeats.push(seat)
                                                    setSelectedSeats([...selectedSeats])
                                                } else {
                                                    setSelectedSeats([...selectedSeats.filter(s => s.id !== seat.id)])
                                                }
                                            }
                                        }} />
                                </td>
                            })

                            return <tr key={index}>
                                <td>
                                    <p>{row.find(s => s !== undefined)?.rowDesignation}</p>
                                </td>
                                {rowCells}
                            </tr>
                        })
                    }
                    </tbody>
                </table>

                <div className="ticket-reservation-btns">
                    <button onClick={() => setTicketReservation(<></>)}>Zrušit</button>
                    <button>Dokončit</button>
                </div>
            </div>
        </div>
    )
}

export default TicketReservation