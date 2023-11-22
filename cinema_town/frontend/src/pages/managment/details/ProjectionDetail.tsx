import { useEffect, useState } from 'react'
import Projection from '../../../models/Projection'
import './ProjectionDetail.css'
import Cinema, { defaultCinema } from '../../../models/Cinema'
import Film, { defaultFilm } from '../../../models/Film'
import DialogErr from '../../../components/DialogErr'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI'
import { defaultHall } from '../../../models/Hall'
import { formatDate } from '../../../global_functions/constantsAndFunction'

export const validateProjection = (data: Projection): Array<string> => {
    let errs: Array<string> = []

    // TODO

    return errs
}

const defCinemas: Cinema[] = []
const defFilms: Film[] = []

const ProjectionDetail = ({
    data, 
    handleInputText, 
    handleInputCheckbox, 
    setData, 
    setErr
}: {
    data: Projection, 
    handleInputText: Function, 
    handleInputCheckbox: Function, 
    setData: Function, 
    setErr: Function
}) => {

    const [selectedCinema, setSelectedCinema] = useState({...defaultCinema})
    const [cinemas, setCinemas] = useState(defCinemas)
    const [films, setFilms] = useState(defFilms)
    const [changeDefData, setChangeDefData] = useState(true)

    const [hallsSelect, setHallsSelect] = useState(<></>)
    const [filmExtendedForm, setFilmExtendedForm] = useState(<></>)

    useEffect(() => {
        load()
    }, [])

    useEffect(() => {
        if (selectedCinema.id !== null) {
            const halls = Object.values(selectedCinema.halls)
            halls.unshift(defaultHall)

            setHallsSelect(
                <>
                    <label>Sál</label>
                    <select value={data.hall.id !== null ? data.hall.id : ''}
                        onChange={(e:any) => {
                            const { value } = e.target

                            if (selectedCinema.halls[value] !== undefined) {
                                data.hall = selectedCinema.halls[value]

    
                                setData({...data})
                            }
                        }}
                    >
                        {
                            halls.map((h, index) => 
                                <option key={index} value={h.id !== null ? h.id : ''}>{h.designation}</option>
                            )
                        }
                    </select>   
                </>
            )
        }
    }, [selectedCinema]) 

    useEffect(() => {
        const cinema = cinemas.find(c => Object.keys(c.halls).filter(hid => hid === data.hall.id).length > 0)

        if (cinema !== undefined)
            setSelectedCinema({...cinema})
    }, [data])

    useEffect(() => {
        
        // ! TOTO převede, čas ze servru na správný 
        if (!(data.dateTime instanceof Date)) {
            const dateTime = new Date()
            dateTime.setFullYear(parseInt(data.dateTime[0]))
            dateTime.setMonth(parseInt(data.dateTime[1])-1)
            dateTime.setDate(parseInt(data.dateTime[2]))
            dateTime.setHours(parseInt(data.dateTime[3])+1)
            dateTime.setMinutes(parseInt(data.dateTime[4]))
            data.dateTime = dateTime          
            setData({...data})
        } 
    }, [data])

    useEffect(() => {
        if (data.film.id !== null) {

            if (changeDefData) {
                data.cost = data.film.defaultCost
                data.dabing = data.film.dabings[0]
                setChangeDefData(false)
                setData({...data})   
            }

            console.log(data);
            

            const cost = data.cost
            const titles = [...data.film.titles]
            titles.unshift("")

            setFilmExtendedForm(
                <>
                    <label>Cena lístku:</label>
                    <input type="number" name="cost" value={cost} onChange={(e:any) => { 
                        const { value } = e.target

                        const cost = Math.max(0, parseFloat(value))

                        data.cost = cost
                        setData({...data})
                    }}/>
                    <label>Titulky</label>
                    <select value={data.title} 
                        onChange={(e:any) => {
                            const { value } = e.target

                            data.title = value
                            setData({...data})
                        }}
                    >
                        {
                            titles.map((t,index) => 
                                <option key={`title ${index}`} value={t}>
                                    {t}
                                </option>
                            )
                        }
                    </select>
                    <label>Dabing</label>
                    <select value={data.dabing} 
                        onChange={(e:any) => {
                            const { value } = e.target

                            data.dabing = value
                            setData({...data})
                        }}
                    >
                        {
                            data.film.dabings.map((d,index) => 
                                <option key={`dabing ${index}`} value={d}>
                                    {d}
                                </option>
                            )
                        }
                    </select>
                    <label>Datum</label>
                    <input type="date" 
                        value={formatDate(data.dateTime)}
                        onChange={(e:any) => {
                            if (data.dateTime instanceof Date) {
                                const { value } = e.target
    
                                const newDate = new Date(value)
                                newDate.setHours(data.dateTime.getHours())
                                newDate.setMinutes(data.dateTime.getMinutes())
    
                                data.dateTime = newDate
    
                                console.log(data.dateTime);
    
                                setData({...data})
                            }
                        }} />
                    <label>Čas</label>
                    {/** TODO dodělat čas jako select po 15 minutách */}
                    <input type="time" 
                        value={parseTime(data.dateTime)} 
                        onChange={(e:any) => {
                            if (data.dateTime instanceof Date) {
                                const { value } = e.target

                                const hours = parseInt(value.split(":")[0])
                                const minutes = parseInt(value.split(":")[1])
                                
                                data.dateTime.setHours(hours)
                                data.dateTime.setMinutes(minutes)
                                setData({...data})     
                            }                      
                        }}/>
                </>
            )
        }
    }, [data, changeDefData])

    const load = async () => {
        try {
            const cinemas = await loadData<Cinema>(ModesEndpoints.Cinama);
            cinemas.unshift({...defaultCinema})
            
            const films = await loadData<Film>(ModesEndpoints.Film)
            films.unshift({...defaultFilm})

            setCinemas(cinemas)
            setFilms(films)
        } catch (error) {
            setErr(<DialogErr err='Přístup odepřen' description={"Nemáte dostatečné oprávnění pro multikin nebo filmů"} dialogSetter={setErr} okText={<a href='/management/'>Ok</a>} />)
        }
    }

    return (
        <>
            <label>Multikino</label>
            <select value={selectedCinema.id !== null ? selectedCinema.id : ''}
                onChange={(e:any) => {

                    const {value} = e.target

                    const cinema = cinemas.find(c => c.id === value)
                    if (cinema !== undefined)
                        setSelectedCinema(cinema)
                }}
            >
                {
                    cinemas.map((c, index) => 
                        <option key={`cinema ${index}`} value={c.id !== null ? c.id : ''}>{`${c.city.name} ${c.street} ${c.houseNumber}`}</option>
                    )
                }
            </select>
            { hallsSelect }
            <label>Film</label>
            <select value={data.film.id !== null ? data.film.id : ''}
                onChange={(e:any) => {

                    const {value} = e.target

                    const film = films.find(f => f.id === value)
                    if (film !== undefined) {
                        setChangeDefData(true)
                        data.film = film
                        setData({...data})
                    }
                }}
            >
                {
                    films.map((f, index) => 
                        <option key={`film ${index}`} value={f.id !== null ? f.id : ''}>
                            {f.name}
                        </option>
                    )
                }
            </select>
            { filmExtendedForm }
        </>
    )
}

export default ProjectionDetail

// TODO
// zkontrolovat co bude vracet backend

function parseTime(date: Date | string[]): string {        
    let hours
    let minutes 
    if (date instanceof Date) {
        hours = date.getHours().toString().padStart(2, '0')
        minutes = date.getMinutes().toString().padStart(2, '0')
    } else {
        hours = date[3].toString().padStart(2, '0')
        minutes = date[4].toString().padStart(2, '0')
    }

    return `${hours}:${minutes}`
}