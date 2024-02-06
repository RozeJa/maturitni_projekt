import Reservation from '../../models/Reservation'
import './ReservationPanel.css'

const ReservationPanel = ({
        reservation
    } : {
        reservation: Reservation
    }) => {
    return (
        <div className='reservation-panel'>
            <div className="reservation-panel-header">
                <p><b>Film:</b> <a href={`/film/${reservation.projection.film.id}`}>{reservation.projection.film.name}</a></p>
                <button>Zrušit rezervaci</button>
            </div>
            <div className="reservation-panel-info">
                <p><b>Počet lístků</b>: {Object.values(reservation.codes).length}</p>
                <p><b>Rezervováno</b>: {reservation.reserved.toString()}</p>
            </div>
        </div>
    )
}

export default ReservationPanel 