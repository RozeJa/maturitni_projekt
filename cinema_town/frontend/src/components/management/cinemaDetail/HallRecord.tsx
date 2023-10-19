import Hall from '../../../models/Hall'
import './HallRecord.css'

const HallRecord = ({
        hall,
        onClick,
        onDelete
    }:{
        hall: Hall,
        onClick: Function,
        onDelete: Function
    }) => {
    return (
        <div key={hall.id} className='hall-record' onClick={() => onClick(hall)} >
            <p>{hall.designation}</p>
            <button onClick={() => onDelete(hall)}>Odebrat</button>
        </div>
    )
}

export default HallRecord