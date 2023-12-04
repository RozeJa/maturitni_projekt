import { useNavigate, useParams } from 'react-router-dom'
import Hall, { defaultHall } from '../../../models/Hall'
import Seat from '../../../models/Seat'
import './HallDetail.css'
import { useEffect, useState } from 'react'
import Cinema from '../../../models/Cinema'
import { ModesEndpoints, loadData, storeData } from '../../../global_functions/ServerAPI'
import { handleErr, handleErrRedirect } from '../../../global_functions/constantsAndFunction'
import SmartInput from '../../../components/SmartInput'

export const validateHall = (data: Hall): Array<string> => {
    let errs: Array<string> = []

    if (data.designation.trim() === '')
        errs.push("Film musí obsahovat nějaký popis.")
    if (data.rows < 1 || data.columns < 1) 
        errs.push("Sál musí obsahovat nějaká sedadla.")
    if (Object.values(data.seats).filter(s => s.seat).length < (data.rows * data.columns / 2 - 1))
        errs.push("Prosím upravte rozložení sálu. Aktuálně obsahuje příliš mnoho prázdných míst. (uličky mezi řadami jsou samozřejmostí a není třeba je vykreslovat).")

    return errs
}

// TODO nefunguje to úplně stpávně
// konkrátně editace a vytváření sálů
const HallDetail = () => {

    const [hall, setHall] = useState(defaultHall)

    const generateField = (): Seat[][]=> {
        
        let newValueField: Seat[][] = []

        for (let i = 0; i < hall.rows; i++) {
            let row = []
            for (let j = 0; j < hall.columns; j++) {
                let seat: Seat = {
                    id: null,
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

                const hallSeat = Object.values(hall.seats).find(s => s.columnIndex === seat.columnIndex && s.rowDesignation === seat.rowDesignation)

                if (hallSeat !== undefined) {
                    row.push(hallSeat)                    
                } else {
                    row.push(seat)
                }
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

    useEffect(() => {
        setValueField(generateField())        
    }, [hall])

    const load = (id: string) => {
        loadData<Hall>(ModesEndpoints.Hall, [id])
            .then(data => {
                const d = data.pop()
                if (d !== undefined) {
                    setHall(d)
                }    
            })
            .catch(err => handleErrRedirect(setErr, err))
    }

    const store = () => {
        const seats: { [key: string]: Seat } = {}
        if (Object.keys(hall.seats).length === 0) {
            valueField.forEach((row, rowIndex) => {
                row.forEach((seat, columnIndex) => {
                    seats[`${rowIndex}${columnIndex}`] = seat
                })
            })

        } else {
            valueField.forEach((row, rowIndex) => {
                row.forEach((seat, columnIndex) => {
                    const editedSeat = Object.values(hall.seats).find(s => s.columnIndex === seat.columnIndex && s.rowIndex === seat.rowIndex)
                    if (editedSeat !== undefined) {
                        editedSeat.seat = seat.seat
                        seats[editedSeat.id !== null ? editedSeat.id : ''] = editedSeat
                    } else {
                        seats[`${rowIndex}${columnIndex}`] = seat
                    }
                })
            })
        }
        
        hall.seats = seats
        console.log(hall);
        
        loadData<Cinema>(ModesEndpoints.Cinama, [cinemaId !== undefined ? cinemaId : ''])
            .then(data => {
                const cinema = data[0]

                // má tento sál
                const halls = cinema.halls !== null ? cinema.halls : {}
                if (Object.keys(cinema.halls).length === 0) {
                    halls[hall.id !== null? hall.id : ''] = hall
                } else {
                    halls[hall.id !== null ? hall.id : `t-${Math.random()}`] = hall
                }
                cinema.halls = halls;
                return cinema;
            })
            .then(cinema => 
                storeData<Cinema>(ModesEndpoints.Cinama, [cinema])
                    .then(data => navigate(`/management/cinemas/${cinemaId}`))
                    .catch(err => handleErr(setErr, err))
            )
            .catch(err => handleErr(setErr, err))

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
                    {row.map((seat) => <td key={`line${seat.columnIndex}${seat.rowIndex}`}>
                        <input 
                            className="checkbox-input" 
                            name={seat.columnIndex + ";" + seat.rowIndex} checked={seat.seat} type="checkbox" 
                            onChange={(event: any) => {
                                const { name, checked } = event.target

                                let columnIndex = name.split(";")[0]
                                let rowIndex = name.split(";")[1]

                                const newValueFieldCopy = valueField.map((row, i) =>
                                    row.map((seat, j) => ({
                                        ...seat,
                                        ["seat"]: i == rowIndex && j == columnIndex ? checked : seat.seat
                                    }))
                                );
                            
                                setValueField([...newValueFieldCopy]);
                            }}/>
                    </td>
                    )}
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
            <SmartInput label={'Onačení sálu'}>
                <input 
                    name={'designation'}
                    type={'text'}
                    value={hall.designation}
                    onChange={(e: any) => handleInputText(e)} />
            </SmartInput>

            <SmartInput label={'Počet řad'}>
                <input 
                    name={'rows'}
                    type={'number'}
                    value={hall.rows}
                    onChange={handleInputNumber} />
            </SmartInput>
            <SmartInput label={'Počet sloupců'}>
                <input 
                name={'columns'}
                type={'number'}
                value={hall.columns}
                onChange={handleInputNumber} />
            </SmartInput>
            
            <h2>Rozložení sedadel</h2>
            <div className="seats">
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