import './ReservationGroup.css'
import Reservation from '../../models/Reservation'
import ReservationPanel from './ReservationPanel'

const ReservationGroup = ({
        reservations,
        date,
        setFsReservations
    } : {
        reservations: Reservation[],
        date: string,
        setFsReservations: Function
    }) => {

    const dateAsArr = date.split(" ")
    const presentDate = `${dateAsArr[2]}.${dateAsArr[1]}.${dateAsArr[0]}`

    return (
        <div className='reservation-group'>
            <div className='reservation-group-header'>
                <h2>{presentDate}</h2> <p>Počet rezervací {reservations.length}</p>
            </div>
            <div className='reservation-group-content'>
                {
                    reservations.map((r,index) => {
                        return <ReservationPanel 
                            key={index}
                            reservation={r}
                            setFsReservations={setFsReservations}
                            />
                    })
                }
            </div>
        </div>
    )
}

export default ReservationGroup