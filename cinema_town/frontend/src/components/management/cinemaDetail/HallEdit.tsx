import { useState } from 'react'
import Hall from '../../../models/Hall'
import './HallEdit.css'

const HallEdit = ({
        hall,
        close,
        addToCinema
    } : {
        hall: Hall,
        close: Function,
        addToCinema: Function
    }) => {

    const [editedHall, setHall] = useState(hall)

    
    const handleInputText = (event: any) => {
        const { name, value } = event.target

        setHall({ ...editedHall, [name]: value })
    }

    const handleInputNulmer = (event: any) => {
        const { name, value } = event.target

        
        
        setHall({ ...editedHall, [name]:  parseInt(value) })
    }

    return (
        <div className='hall-edit-dialog'>
            <div className="hall-edit-body">
                <h1>{editedHall.id === '' ? 'Nový sál' : `Sál ${editedHall.designation}`}</h1>
               <label>Onačení sálu</label> 
               <input name='designation' type="text" onChange={handleInputText} />
               <label>Počet řad</label> 
               <input name='rows' type="number" onChange={handleInputNulmer} />
               <label>Počet sloupců</label> 
               <input name='columns' type="number" onChange={handleInputNulmer} />
               
            </div>
        </div>
    )
}

export default HallEdit