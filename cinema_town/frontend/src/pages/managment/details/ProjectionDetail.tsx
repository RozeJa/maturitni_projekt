import { useEffect, useState } from 'react'
import Projection from '../../../models/Projection'
import './ProjectionDetail.css'
import Cinema, { defaultCinema } from '../../../models/Cinema'
import Film, { defaultFilm } from '../../../models/Film'
import DialogErr from '../../../components/DialogErr'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI'
import { defaultHall } from '../../../models/Hall'
import { formatDate, handleErrRedirect } from '../../../global_functions/constantsAndFunction'
import { useParams } from 'react-router-dom'
import SmartInput from '../../../components/SmartInput'

export const validateProjection = (data: Projection): Array<string> => {
    let errs: Array<string> = []

    if (data.hall.id === null)
        errs.push("Promítání musí probýhat v nějakém sále.")
    if (data.film.id === null)
        errs.push("Musí se promítat nějaký film.")
    if (data.cost < 0) 
        errs.push("Naše společnost lidem za návštěvu kin neplatí :D.")
    
    const date = new Date()
    date.setDate(date.getDate() + 1)
    console.log(date);
    if (data.dateTime instanceof Date)
        if (date.getTime() > data.dateTime.getTime())
            errs.push("Nejdřive můžete zadat promítání JEDEN den dopředu!")
    
    
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

    const { id } = useParams<string>()

    useEffect(() => {
        loadData<Cinema>(ModesEndpoints.Cinama)
            .then(data => {
                data.unshift({...defaultCinema})
                setCinemas(data)
            })
            .catch(err => handleErrRedirect(setErr, err))
            
         loadData<Film>(ModesEndpoints.Film)
            .then(data => {
                data.unshift({...defaultFilm})
                  setFilms(data)
               })
           .catch(err => handleErrRedirect(setErr, err))
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
    }, [data, cinemas])

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
            if (changeDefData && id === undefined) {
                data.cost = data.film.defaultCost
                data.dabing = data.film.dabings[0]
                setChangeDefData(false)
                setData({...data})   
            }            

            const cost = data.cost
            const titles = [...data.film.titles]
            titles.unshift("")

            setFilmExtendedForm(
                <>
                    <SmartInput
                        label={'Cena lístku:'}
                        name={'cost'}
                        type={'number'}
                        value={cost}
                        onChange={(e:any) => { 
                            const { value } = e.target
    
                            const cost = Math.max(0, parseFloat(value))
    
                            data.cost = cost
                            setData({...data})
                        }}
                    /> 

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
                    <SmartInput
                        label={'Datum'}
                        name={'date'}
                        type={'date'}
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
                        }}
                    /> 
                    <SmartInput
                        label={'Čas'}
                        name={'time'}
                        type={'time'}
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
                        }}
                    /> 
                </>
            )
        }
    }, [data, changeDefData])

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
                        <option key={`cinema ${index}`} value={c.id !== null ? c.id : ''}>{`${c.city.name}, ${c.street}, ${c.houseNumber}`}</option>
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