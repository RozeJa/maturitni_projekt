import { useEffect, useState } from 'react'
import { ModesEndpoints, deleteData, loadData } from '../../global_functions/ServerAPI'
import Reservation from '../../models/Reservation'
import './ReservationPanel.css'
import Cinema, { defaultCinema } from '../../models/Cinema'
import { formatDateTime } from '../../global_functions/constantsAndFunction'

const ReservationPanel = ({
        reservation,
        setFsReservations
    } : {
        reservation: Reservation,
        setFsReservations: Function
    }) => {

    const [cinema, setCinema] = useState({...defaultCinema})
    
    useEffect(() => {
        const hallId = reservation.projection.hall.id !== null ? reservation.projection.hall.id : ""
        loadData<Cinema>(ModesEndpoints.CinamaByHall, [hallId])
            .then(data => {                
                setCinema({...data[0]})
            })
            .catch(err => {
                console.log("problem");
            })
    }, [])

    let rezerved = formatDateTime(reservation.reserved)
    let projectionDate = formatDateTime(reservation.projection.dateTime)

    const tickets: { [key: string]: number} = {}

    Object.values(reservation.codes).forEach(ac => {
        if (tickets[ac.name] !== undefined) 
            tickets[ac.name] += 1
        else tickets[ac.name] = 1
    })

    const isRemovable = (reservationDate: Date | string[]): boolean => {

        const date = new Date();
        date.setMinutes(date.getMinutes() - 15);
    
        if (reservationDate instanceof Date) {
            return false
        } else {
            const reservationDateFromArr = new Date(
                parseInt(reservationDate[0]), 
                parseInt(reservationDate[1]) - 1, 
                parseInt(reservationDate[2]), 
                parseInt(reservationDate[3]) + 1, 
                parseInt(reservationDate[4]))
            return reservationDateFromArr.toISOString().localeCompare(date.toISOString()) >= 0
        }
    }

    const removeReservation = () => {
        deleteData<Reservation>(ModesEndpoints.Reservation, [reservation])
        .then(data => {
            setFsReservations(reservation)
        })
        .catch(err => console.log(err))
    }

    return (
        <div className='reservation-panel'>
            <div className="reservation-panel-header">
                <h2>Rezervace na film <a href={`/film/${reservation.projection.film.id}`}>{reservation.projection.film.name}</a></h2>
                {
                    isRemovable(reservation.reserved) ? <button onClick={removeReservation}>Zrušit rezervaci</button> : <></>
                }
            </div>
            <div className="reservation-panel-info">
                <p><b>Multikino</b>: {cinema.street} {cinema.houseNumber}, {cinema.city.name}</p>
                <p><b>Konání představení</b>: {projectionDate}</p>
                <p><b>Rezervace vytvořena</b>: {rezerved}</p>
                <p><b>Cena rezervace</b>: {reservation.totalCost} Kč</p>
                <p><b>Počet lístků</b>: {Object.values(reservation.codes).length}</p>
                {
                    Object.keys(tickets).map((ticketCategory, index) => {
                        return <p key={index} className="reservation-panel-info-category"><b>{ticketCategory}</b>: {tickets[ticketCategory]}</p>
                    }) 
                }
            </div>
        </div>
    )
}

export default ReservationPanel 