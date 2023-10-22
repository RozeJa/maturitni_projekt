import { useNavigate } from 'react-router-dom'
import Cinema from '../../../models/Cinema'
import Hall from '../../../models/Hall'
import './HallRecord.css'
import { ModesEndpoints, storeData } from '../../../global_functions/ServerAPI'

const HallRecord = ({
        hall,
        cinema,
        setCinema
    }:{
        hall: Hall,
        cinema: Cinema,
        setCinema: any
    }) => {

    const navigate = useNavigate()

    const removeHall = async (hall: Hall) => {
        if (cinema.halls !== null) {
            // odeber z kina sál 
            cinema.halls.delete(hall.id !== null ? hall.id : '')
            // pošli update kina na server
            setCinema(await storeData<Cinema>(ModesEndpoints.Cinama, [cinema]))
        }
    }

    return (
        <div key={hall.id} className='hall-record' onClick={() => navigate(`/management/halls/${cinema.id}/${hall.id}`)} >
            <p>{hall.designation}</p>
            <button onClick={() => removeHall(hall)}>Odebrat</button>
        </div>
    )
}

export default HallRecord