import { useEffect, useState } from 'react'
import Projection from '../../../models/Projection'
import './ProjectionDetail.css'
import Cinema, { defaultCinema } from '../../../models/Cinema'
import Film, { defaultFilm } from '../../../models/Film'
import DialogErr from '../../../components/DialogErr'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI'
import { defaultHall } from '../../../models/Hall'
import { log } from 'console'

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

                            console.log(value);
                            console.log(selectedCinema);
                            
                            
                            data.hall = selectedCinema.halls[value]

                            setData({...data})
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
        if (data.film.id !== null) {

            const cost = data.cost === 0 ? data.film.defaultCost : data.cost
            const titles = [...data.film.titles]
            titles.unshift("")

            setFilmExtendedForm(
                <>
                    <label>Cena lístku:</label>
                    <input type="number" name="cost" value={cost} onChange={(e:any) => { 
                        const { value } = e.target

                        const cost = Math.max(0, parseFloat(value))

                        data.cost = cost
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
                        value={parseDate(data.dateTime)}
                        onChange={(e:any) => console.log(e.target.value)
                        }    
                    />
                    <label>Čas</label>
                    {/** TODO dodělat čas jako select po 15 minutách */}
                </>
            )
        }
    }, [data])

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
function parseDate(date: Date): string {
    
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    return `${year}-${month}-${day}`
}