import { useEffect, useState } from 'react'
import Hall from '../../../models/Hall'
import './HallEdit.css'
import Seat from '../../../models/Seat'

const HallEdit = ({
        hall,
        close,
        addToCinema
    } : {
        hall: Hall,
        close: Function,
        addToCinema: Function
    }) => {

    const generateField = (): Seat[][]=> {
        let newValueField: Seat[][] = []

        for (let i = 0; i < editedHall.rows; i++) {
            let row = []
            for (let j = 0; j < editedHall.columns; j++) {
                let seat: Seat = {
                    id: '',
                    rowDesignation: '',
                    number: 0,
                    rowIndex: 0,
                    columnIndex: 0,
                    seat: true
                }
                seat.columnIndex = j
                seat.number = j+1
                seat.rowIndex = i
                seat.rowDesignation = (i+1).toString()
                row.push(seat)
            }
            newValueField.push(row)
        }
        return newValueField
    }

    const [editedHall, setHall] = useState(hall)
    const [valueField, setValueField] = useState(generateField())
    const [displayField, setDisplayField] = useState(<></>)

    
    const handleInputText = (event: any) => {
        const { name, value } = event.target

        setHall({ ...editedHall, [name]: value })
    }

    const handleInputNumber = (event: any) => {
        const { name, value } = event.target

        if (value <= 2) {
            setHall({ ...editedHall, [name]: 2})
        } else {
            setHall({ ...editedHall, [name]:  parseInt(value)})
        }
    }

    useEffect(() => {
        setValueField(generateField());
    }, [editedHall])

    useEffect(()=> {
    
        const table = <table>
            <tbody>
            {valueField.map((row) => {
                let s = row[0]
                return <tr key={`row${s.rowDesignation}${s.number}${s.rowIndex}${s.columnIndex}`}>
                    {row.map((seat) => {
                        
                        return <td 
                        key={`line${seat.columnIndex}${seat.rowIndex}`}><input 
                        className="checkbox-input" 
                        name={seat.columnIndex + ";" + seat.rowIndex} checked={seat.seat} type="checkbox" 
                        onChange={(event: any) => {
                            const { name, checked } = event.target

                            let columnIndex = name.split(";")[0]
                            let rowIndex = name.split(";")[1]

                            const newValueFieldCopy = valueField.map((row, i) =>
                                row.map((seat, j) => ({
                                    ...seat,
                                    isSelected: i == rowIndex && j == columnIndex ? checked : seat.seat,
                                }))
                            );
                        
                            setValueField(newValueFieldCopy);
                        }}/></td>
                    })}
                </tr>
            })}
            </tbody>
        </table>
        setDisplayField(table)
    }, [valueField])

    return (
        <div className='hall-edit-dialog'>
            <div className="hall-edit-body">
                <h1>{editedHall.id === null ? 'Nový sál' : `Sál ${editedHall.designation}`}</h1>
                <label>Onačení sálu</label> 
                <input name='designation' type="text" onChange={handleInputText} />
                <label>Počet řad</label> 
                <input name='rows' type="number" value={hall.rows} onChange={handleInputNumber} />
                <label>Počet sloupců</label> 
                <input name='columns' type="number" value={hall.columns} onChange={handleInputNumber} />
                <div className="seats">
                    <h2>Rozložení sedadel</h2>
                    {displayField}
                </div>
                <div className='detail-submit'>
                    <button onClick={()=> {
                        addToCinema({ ...editedHall, ["seats"]: valueField})
                    }}>
                        Uložit změny
                    </button>
                    <button onClick={()=>close()}>
                        Zahodit změny
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HallEdit