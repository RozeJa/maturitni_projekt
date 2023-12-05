import { useNavigate } from 'react-router-dom'
import Cinema from '../../../models/Cinema'
import Hall from '../../../models/Hall'
import './HallRecord.css'
import { ModesEndpoints, storeData } from '../../../global_functions/ServerAPI'

const HallRecord = ({
        hall,
        cinema,
        setCinema,
        unremovableHalls
    }:{
        hall: Hall,
        cinema: Cinema,
        setCinema: any,
        unremovableHalls: Hall[]
    }) => {

    const navigate = useNavigate()

    const removeHall = async (hall: Hall) => {
        
        if (cinema.halls !== null && unremovableHalls.find(h => h.id === hall.id) !== undefined) {
            // odeber z kina sál 
            delete cinema.halls[hall.id !== null ? hall.id : '']
            // pošli update kina na server
            setCinema((await storeData<Cinema>(ModesEndpoints.Cinama, [cinema]))[0])
        }
    }

    return (
        <div className='hall-record' >
            <p onClick={() => navigate(`/management/halls/${cinema.id}/${hall.id}`)}><b>Sál: {hall.designation}</b></p>
            <button
                className={unremovableHalls.find(h => h.id === hall.id) === undefined ? 'hall-record-dizabled' : ''} 
                onClick={() => removeHall(hall)}>Odebrat</button>
        </div>
    )
}

export default HallRecord