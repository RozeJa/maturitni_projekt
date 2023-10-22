import { useNavigate, useParams } from 'react-router-dom'
import Hall, { defaultHall } from '../../../models/Hall'
import Seat from '../../../models/Seat'
import './HallDetail.css'
import { useEffect, useState } from 'react'
import Cinema from '../../../models/Cinema'
import { ModesEndpoints, loadData, storeData } from '../../../global_functions/ServerAPI'
import DialogErr from '../../../components/DialogErr'

export const validateHall = (data: Hall): Array<string> => {
    let errs: Array<string> = []

    // TODO

    return errs

}

const HallDetail = () => {

    const [hall, setHall] = useState(defaultHall)

    const generateField = (): Seat[][]=> {
        let newValueField: Seat[][] = []

        for (let i = 0; i < hall.rows; i++) {
            let row = []
            for (let j = 0; j < hall.columns; j++) {
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

    const [valueField, setValueField] = useState(generateField())
    const [displayField, setDisplayField] = useState(<></>)
    const [err, setErr] = useState(<></>)

    const {cinemaId} = useParams<string>()
    const { id } = useParams<string>()
    const navigate = useNavigate()  

    useEffect(() => {
        if (typeof id === 'string') {
            load(id)
        }
        
    }, [])

    const load = async (id: string) => {
        try {
            let data = (await loadData<Hall>(ModesEndpoints.Hall, [id])).pop()
            if (data !== undefined ) {
                console.log(data);
                
                setHall(data)
            }            
        } catch (error) {
            // TODO rozpracovat errory
            setErr(<DialogErr err='Přístup odepřen' description={"Nemáte dostatečné oprávnění pro načtení dat"} dialogSetter={setErr} okText={<a href='/management/'>Ok</a>} />)

            console.log(error);
        }
    }

    const store = async () => {
    
        try {
            // načti kino
            let cinema: Cinema = (await loadData<Cinema>(ModesEndpoints.Cinama, [cinemaId !== undefined ? cinemaId : '']))[0]
            // má tento sál
            if (cinema.halls !== null) {
                cinema.halls.set(hall.id !== null? hall.id : '', hall)
            } else {
                cinema.halls = new Map()
                cinema.halls.set(hall.id !== null? hall.id : `t-${Math.random()}`, hall)
            }
            
            (await storeData<Cinema>(ModesEndpoints.Cinama, [cinema]))
            navigate(`/management/cinemas/${cinemaId}`)
        } catch (error) {
            setErr(<DialogErr err='Nastala chyba při načítání nebo ukládání dat na server' description='Přesné změní chyby nebylo dosud implementováno' dialogSetter={setErr} okText={'ok'} />)
        }
    }

    const handleInputNumber = (event: any) => {
        const { name, value } = event.target

        if (value <= 2) {
            setHall({ ...hall, [name]: 2})
        } else {
            setHall({ ...hall, [name]:  parseInt(value)})
        }
    }

    useEffect(() => {
        setValueField(generateField());
    }, [hall])

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

    const handleInputText = (event: any) => {
        const { name, value } = event.target

        setHall({ ...hall, [name]: value })
    }

    return (
        <div className="hall-edit-body">
            {err}
            <h1>{hall.id === null ? 'Nový sál' : `Sál ${hall.designation}`}</h1>
            <label>Onačení sálu</label> 
            <input name='designation' type="text" onChange={(e: any) => handleInputText(e)} />
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
                    store()
                }}>
                    Uložit změny
                </button>
                <a href={`/management/cinemas/${cinemaId}`}>
                    Zahodit změny
                </a>
            </div>
        </div>
    )

}

export default HallDetail