import './ReservationGroup.css'
import Reservation from '../../models/Reservation'
import ReservationPanel from './ReservationPanel'

const ReservationGroup = ({
        reservations,
        date
    } : {
        reservations: Reservation[],
        date: string
    }) => {


    return (
        <div className='reservation-groupp'>
            <h1>{date}</h1>
            {
                reservations.map((r,index) => {
                    return <ReservationPanel key={index}
                        reservation={r}
                        />
                })
            }
        </div>
    )
}

export default ReservationGroup