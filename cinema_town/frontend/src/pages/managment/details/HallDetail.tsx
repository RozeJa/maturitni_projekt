import { useNavigate, useParams } from 'react-router-dom'
import Hall, { defaultHall } from '../../../models/Hall'
import Seat from '../../../models/Seat'
import './HallDetail.css'
import { useEffect, useState } from 'react'
import Cinema from '../../../models/Cinema'
import { ModesEndpoints, loadData, storeData } from '../../../global_functions/ServerAPI'
import { handleErr, handleErrRedirect } from '../../../global_functions/constantsAndFunction'
import SmartInput from '../../../components/SmartInput'
import DialogErr from '../../../components/DialogErr'

export const validateHall = (data: Hall): Array<string> => {
    let errs: Array<string> = []

    if (data.designation.trim() === '')
        errs.push("Film musí obsahovat nějaký popis.")
    if (data.rows < 2 || data.columns < 2) 
        errs.push("Sál musí obsahovat nějaká sedadla. Minimální povolená velikost sálu je 2x2.")

    return errs
}

// TODO nefunguje to úplně stpávně
// konkrátně editace a vytváření sálů
const HallDetail = () => {

    const [hall, setHall] = useState(defaultHall)
    const [designation, setDesignation] = useState("")

    const generateField = (): Seat[][]=> {
        
        let newValueField: Seat[][] = []

        if (hall.rows === 0 || hall.columns === 0)
            return newValueField;

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
        if (designation === "") 
            setDesignation(hall.designation)
    }, [hall])

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
        let errs: Array<string> = validateHall(hall)
        if (errs.length > 0) {
            let errLog: string = ''

            errs.forEach((err) => errLog += ` ${err}`);

            setErr(<DialogErr err='Chybně vyplněný formulář' description={errLog} dialogSetter={setErr} okText={'Ok'} />)
            return
        }

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
        try {
            const { name, value } = event.target

            const data = parseInt(value, 10)

            if (data <= 0 || isNaN(data)) {
                setHall({ ...hall, [name]: 0})
            } else {
                setHall({ ...hall, [name]: data})
            }

        } catch (error) {
            setHall({ ...hall})
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
            <h1>{hall.id === null ? 'Nový sál' : `Sál ${designation}`}</h1>
            <SmartInput label={'Označení sálu'}>
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
                <a href={`/management/cinemas/${cinemaId}`}>
                    Zahodit změny
                </a>
                <button onClick={()=> {
                    store()
                }}>
                    Uložit změny
                </button>
            </div>
        </div>
    )

}

export default HallDetail