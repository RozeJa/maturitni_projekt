import { useEffect, useState } from 'react'
import Film from '../../models/Film'
import './TicketReservation.css'
import Cinema, { defaultCinema } from '../../models/Cinema'
import Projection, { defaultProjection } from '../../models/Projection'
import { ModesEndpoints, loadData } from '../../global_functions/ServerAPI'
import { formatDateTime, handleErrRedirect } from '../../global_functions/constantsAndFunction'
import Reservation from '../../models/Reservation'
import Seat from '../../models/Seat'
import queryString from 'query-string'
import AgeCategory from '../../models/AgeCategory'
import ReservationConfirm from './ReservationConfirm'

type SeparedProjections = { [key: string]: Projection[] }

const defSeparedProjections: SeparedProjections = {}

const defCinemas: Cinema[] = []
const defProjections: Projection[] = []
const defAgeCategories: AgeCategory[] = []
const defAgeCategoriesCount: { [key: string]: number} = {}
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
    const [ageCategories, setAgeCategories] = useState([...defAgeCategories])
    const [reservations, setReservations] = useState([...defReservations])

    const [selectedCinema, setSelectedCinema] = useState({ ...defCinema })
    const [selectedProjection, setSelectedProjection] = useState({ ...defProjection })
    const [projectionsByDabTit, setProjectionsByDatTit] = useState({ ...defSeparedProjections })

    const [seatsField, setSeatsFiel] = useState([...defSeatsField])
    const [selectedSeats, setSelectedSeats] = useState([...defSeats])
    const [ageCategoriesCount, setAgeCategoriesCount] = useState({...defAgeCategoriesCount})

    const [reservationConfirm, setReservationConfirm] = useState(<></>)
   
    useEffect(() => {        
        loadData<Projection>(ModesEndpoints.ProjectionByFilm, [film.id ? film.id : ""])
            .then(data => setProjections([...data]))
            .catch(err => handleErrRedirect(setErr, err))
        loadData<AgeCategory>(ModesEndpoints.AgeCategory)
            .then(data => setAgeCategories([...data]))
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
        ageCategories.forEach(ac => ageCategoriesCount[ac.id !== null ? ac.id : ''] = 0)
        setAgeCategoriesCount({...ageCategoriesCount})
    }, [ageCategories])

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

    const countTickets = (): number => {
        let sum = 0

        Object.values(ageCategoriesCount).forEach(ac => sum += ac)

        return sum
    }

    return (
        <div className='ticket-reservation-dialog'>
            {reservationConfirm}
            <div className='ticket-reservation'>
                <div className="ticket-reservation-header">
                    <h1>{film.name}</h1>
                    <div>
                        <label>Vyberte kino:</label>
                        <select 
                            name="selectedCinema"
                            value={selectedCinema.id !== null ? selectedCinema.id : ''}
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
                                .map((c, index) => {
                                    let cinemaName = `${c.city.name}, ${c.street}, ${c.houseNumber}`

                                    if (cinemaName.trim() === ", ,")
                                        cinemaName = "Vyberte multikino"
                                    return  <option key={index} value={c.id ? c.id : ''}>
                                        {cinemaName}
                                    </option>
                                })}
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
                        let dateToShow: string = formatDateTime(p.dateTime)

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

                <table className='ticket-reservation-ticket-table'>
                    <thead>
                        <tr>
                            <th>Cenová kategorie</th>
                            <th>Cena lístku</th>
                            <th>Počet lístků</th>
                            <th>Cena celkem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ageCategories.map((ac,index) => {
  
                            const inputVal = ac.id !== null ? ageCategoriesCount[ac.id] : 0

                            return <tr key={index}>
                                <td>{ac.name}</td>
                                <td>{Math.round(ac.priceModificator * selectedProjection.cost)} Kč</td>
                                <td>
                                    <input 
                                        type="number" 
                                        name={ac.id !== null ? ac.id : ''} 
                                        value={inputVal}
                                        onChange={(e:any) => {
                                            const { name, value } = e.target

                                            const count = parseInt(value)
                                            
                                            if (count < ageCategoriesCount[name]) {
                                                if (count >= 0 && countTickets() - ageCategoriesCount[name] + count >= selectedSeats.length) 
                                                    setAgeCategoriesCount({...ageCategoriesCount, [name]: count})
                                                
                                            } else if (count >= 0)                                                 
                                                setAgeCategoriesCount({...ageCategoriesCount, [name]: count})

                                        }} />
                                </td>
                                <td>{Math.round(ac.priceModificator * selectedProjection.cost) * inputVal} Kč</td>
                            </tr>}
                        )}
                    </tbody>
                </table>
                
                { seatsField.length !== 0 ? <h3><hr />Zde se nachází promítací plátno<hr /></h3> : <></> }
                
                <table>
                    <tbody>
                    { /**TODO předělat není to komponenta, jsou to data */
                        seatsField.map((row,index) => {
                            const rowCells = row.map((seat,index) => {

                                if (seat === undefined) {
                                    return <td key={index} >
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
                                        key={index}
                                        className={isReserved ? 'ticket-reservation-unreservable' : isSelected ? 'ticket-reservation-selected' : ''} 
                                        type="checkbox" 
                                        checked={isReserved || isSelected} 
                                        disabled={isReserved} 
                                        onChange={(e:any) => {
                                            if (!isReserved) {
                                                const {checked} = e.target

                                                if (checked && selectedSeats.length + 1 <= countTickets()) {
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
                    <button 
                        className={countTickets() === selectedSeats.length && selectedSeats.length > 0 ? "" : "ticket-reservation-btns-disable"}
                        onClick={() => {
                            if (countTickets() === selectedSeats.length && selectedSeats.length > 0) {
                                
                                // vyhoď pop up, který od uživatele vezme platební údaje
                                setReservationConfirm(
                                    <ReservationConfirm 
                                        setReservationConfirm={() => setReservationConfirm(<></>)}
                                        ageCategories={ageCategories} 
                                        ageCategoriesCount={ageCategoriesCount} 
                                        seats={selectedSeats}
                                        projection={selectedProjection}
                                        cinema={selectedCinema}
                                        />
                                )
                            }
                        }} >
                        Dokončit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TicketReservation