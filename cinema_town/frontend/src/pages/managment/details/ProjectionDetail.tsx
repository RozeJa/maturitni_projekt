import { useEffect, useState } from 'react'
import Projection, { defaultProjection } from '../../../models/Projection'
import './ProjectionDetail.css'
import Cinema, { defaultCinema } from '../../../models/Cinema'
import Film, { defaultFilm } from '../../../models/Film'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI'
import { defaultHall } from '../../../models/Hall'
import { formatDate, handleErrRedirect } from '../../../global_functions/constantsAndFunction'
import { useParams } from 'react-router-dom'
import SmartInput from '../../../components/SmartInput'
import { storeDetailData } from './Detail'

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
    setErr
}: {
    data: Projection,
    setErr: Function
}) => {
    const [tempData, setTempData] = useState(defaultProjection)
    useEffect(() => {
        setTempData(data)
        storeDetailData(tempData)
    }, [data])
    useEffect(() => {
        storeDetailData(tempData)
    }, [tempData])

    const [selectedCinema, setSelectedCinema] = useState({ ...defaultCinema })
    const [cinemas, setCinemas] = useState(defCinemas)
    const [films, setFilms] = useState(defFilms)
    const [changeDefData, setChangeDefData] = useState(true)

    const [hallsSelect, setHallsSelect] = useState(<></>)
    const [filmExtendedForm, setFilmExtendedForm] = useState(<></>)

    const { id } = useParams<string>()

    useEffect(() => {
        loadData<Cinema>(ModesEndpoints.Cinama)
            .then(data => {
                data.unshift({ ...defaultCinema })
                setCinemas(data)
            })
            .catch(err => handleErrRedirect(setErr, err))

        loadData<Film>(ModesEndpoints.Film)
            .then(data => {
                data.unshift({ ...defaultFilm })
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
                    <select value={tempData.hall.id !== null ? tempData.hall.id : ''}
                        onChange={(e: any) => {
                            const { value } = e.target

                            if (selectedCinema.halls[value] !== undefined) {
                                tempData.hall = selectedCinema.halls[value]

                                setTempData({ ...tempData })
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
            setSelectedCinema({ ...cinema })
    }, [tempData, cinemas])

    useEffect(() => {

        // ! TOTO převede, čas ze servru na správný 
        if (!(tempData.dateTime instanceof Date)) {
            const dateTime = new Date()
            dateTime.setFullYear(parseInt(tempData.dateTime[0]))
            dateTime.setMonth(parseInt(tempData.dateTime[1]) - 1)
            dateTime.setDate(parseInt(tempData.dateTime[2]))
            dateTime.setHours(parseInt(tempData.dateTime[3]) + 1)
            dateTime.setMinutes(parseInt(tempData.dateTime[4]))
            tempData.dateTime = dateTime
            setTempData({ ...tempData })
        }
    }, [tempData])

    useEffect(() => {
        if (tempData.film.id !== null) {
            if (changeDefData && id === undefined) {
                tempData.cost = tempData.film.defaultCost
                tempData.dabing = tempData.film.dabings[0]
                setChangeDefData(false)
                setTempData({ ...tempData })
            }

            const cost = tempData.cost
            const titles = [...tempData.film.titles]
            titles.unshift("")

            setFilmExtendedForm(
                <>
                    <SmartInput label={'Cena lístku:'}>
                        <input
                            name={'cost'}
                            type={'number'}
                            value={cost}
                            onChange={(e: any) => {
                                const { value } = e.target

                                const cost = Math.max(0, parseFloat(value))

                                tempData.cost = cost
                                setTempData({ ...tempData })
                            }} />
                    </SmartInput>

                    <label>Titulky</label>
                    <select value={tempData.title}
                        onChange={(e: any) => {
                            const { value } = e.target

                            tempData.title = value
                            setTempData({ ...tempData })
                        }}
                    >
                        {
                            titles.map((t, index) =>
                                <option key={`title ${index}`} value={t}>
                                    {t}
                                </option>
                            )
                        }
                    </select>
                    <label>Dabing</label>
                    <select value={tempData.dabing}
                        onChange={(e: any) => {
                            const { value } = e.target

                            tempData.dabing = value
                            setTempData({ ...tempData })
                        }}
                    >
                        {
                            tempData.film.dabings.map((d, index) =>
                                <option key={`dabing ${index}`} value={d}>
                                    {d}
                                </option>
                            )
                        }
                    </select>
                    <SmartInput label={'Datum'}>
                        <input
                            name={'date'}
                            type={'date'}
                            value={formatDate(tempData.dateTime)}
                            onChange={(e: any) => {
                                if (tempData.dateTime instanceof Date) {
                                    const { value } = e.target

                                    const newDate = new Date(value)
                                    newDate.setHours(tempData.dateTime.getHours())
                                    newDate.setMinutes(tempData.dateTime.getMinutes())

                                    tempData.dateTime = newDate

                                    setTempData({ ...tempData })
                                }
                            }} />
                    </SmartInput>
                    <SmartInput label={'Čas'}>
                        <input
                            name={'time'}
                            type={'time'}
                            value={parseTime(tempData.dateTime)}
                            onChange={(e: any) => {
                                if (tempData.dateTime instanceof Date) {
                                    const { value } = e.target

                                    const hours = parseInt(value.split(":")[0])
                                    const minutes = parseInt(value.split(":")[1])

                                    tempData.dateTime.setHours(hours)
                                    tempData.dateTime.setMinutes(minutes)
                                    setTempData({ ...tempData })
                                }
                            }} />
                    </SmartInput>
                </>
            )
        }
    }, [tempData, changeDefData])

    return (
        <>
            <label>Multikino</label>
            <select value={selectedCinema.id !== null ? selectedCinema.id : ''}
                onChange={(e: any) => {

                    const { value } = e.target

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
            {hallsSelect}
            <label>Film</label>
            <select value={tempData.film.id !== null ? tempData.film.id : ''}
                onChange={(e: any) => {

                    const { value } = e.target

                    const film = films.find(f => f.id === value)
                    if (film !== undefined) {
                        setChangeDefData(true)
                        tempData.film = film
                        setTempData({ ...tempData })
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
            {filmExtendedForm}
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