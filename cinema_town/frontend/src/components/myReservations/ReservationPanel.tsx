import { ModesEndpoints, deleteData } from '../../global_functions/ServerAPI'
import Reservation from '../../models/Reservation'
import './ReservationPanel.css'

const ReservationPanel = ({
        reservation,
        setFsReservations
    } : {
        reservation: Reservation,
        setFsReservations: Function
    }) => {

    const reservedDate = reservation.reserved
    let rezerved = ''
    
    if (reservedDate instanceof Date) 
        rezerved = `${reservedDate.getDay()}.${reservedDate.getMonth() + 1}.${reservedDate.getFullYear()} ${reservedDate.getHours()}:${reservedDate.getMinutes()}`
    else rezerved = `${reservedDate[2]}.${reservedDate[1]}.${reservedDate[0]} ${reservedDate[3].toString().padStart(2,"0")}:${reservedDate[4].toString().padStart(2,"0")}`

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
                parseInt(reservationDate[3]), 
                parseInt(reservationDate[4]))

            return reservationDateFromArr.toUTCString().localeCompare(date.toUTCString()) >= 0
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
                <p><b>Rezervováno</b>: {rezerved}</p>
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