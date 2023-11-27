import { useNavigate } from 'react-router-dom'
import './ProjectionsSpreadsheet.css'
import { useEffect, useState } from 'react'
import Projection from '../../../models/Projection'
import Cinema, { defaultCinema } from '../../../models/Cinema'
import { ModesEndpoints, deleteData, loadData } from '../../../global_functions/ServerAPI'
import Filter from '../../../components/management/Filter'
import Tile from '../../../components/management/Tile'
import Reservation from '../../../models/Reservation'
import { handleErr } from '../../../global_functions/constantsAndFunction'

const defProjections: Projection[] = []
const defCinemas: Cinema[] = []
const defReservations: Reservation[] = []
const defCinema: Cinema = defaultCinema
const defAny: any = null

const ProjectionsSpreadsheet = () => {

    const navigate = useNavigate()
    const [projections, setProjections] = useState([...defProjections])
    const [cinemas, setCinemas] = useState([...defCinemas])
    const [reservations, setReservations] = useState([...defReservations])

    const [filtredProjections, setFiltredProjections] = useState([...defProjections])
    const [selectedCinema, setSelectedCinema] = useState({...defCinema})
    const [lastEvent, setLastEvent] = useState(defAny)
    
    const [err, setErr] = useState(<></>)

    useEffect(() => {
        loadData<Projection>(ModesEndpoints.Projection)
            .then(data => {
                setProjections(
                    data.sort((a,b) => a.dateTime.toLocaleString().localeCompare(b.dateTime.toLocaleString()))
                )
            })
            .catch(err => handleErr(setErr, err))


        loadData<Cinema>(ModesEndpoints.Cinama)
            .then(data => {
                data.unshift({...defCinema})
                setCinemas(data)
            })
            .catch(err => handleErr(setErr, err))

        loadData<Reservation>(ModesEndpoints.Reservation)
            .then(data => setReservations(data))
            .catch(err => handleErr(setErr, err))
    }, [])

    useEffect(() => {
        setFiltredProjections(projections)
    }, [projections])

    useEffect(() => {
        filter(lastEvent)
    }, [selectedCinema])

    const remove = (projection: Projection) => {
        deleteData<Projection>(ModesEndpoints.Projection, [projection])
            .then(res => setProjections([...projections.filter(d => d.id !== projection.id)]))
            .catch(err => handleErr(setErr, err))
    }

    const filter = (e:any) => {
        if (e !== null) {
            const { value } = e.target
    
            const newData = projections.filter(p => (
                (
                    p.film.name.toLowerCase().split(value.toLowerCase()).length > 1 ||
                    p.film.name.toLowerCase() === value.toLowerCase() ||
                    p.cost == value ||
                    p.dabing.toLowerCase() === value.toLowerCase() ||
                    p.title.toLowerCase() === value.toLowerCase() ||
                    p.dateTime.toString().toLowerCase() === value.toLowerCase() ||
                    p.dateTime.toString().toLowerCase().split(value.toLowerCase()).length > 1
                ) &&
                (
                    selectedCinema.id === null ||
                    Object.values(selectedCinema.halls).find(h => h.id === p.hall.id)
                )
            ))
    
            setFiltredProjections(newData)
        } else {
            const newData = projections.filter(p => (
                selectedCinema.id === null ||
                Object.values(selectedCinema.halls).find(h => h.id === p.hall.id)
            ))
    
            setFiltredProjections(newData)
        }

        setLastEvent(e)
    }
    
    return (
        <div className='sp'>
            {err}
            <div className="sp-header">
                <Filter filter={filter} />
                <div className="projection-header-filter-cinema">
                    <label>Multikino :</label>
                    <select onChange={(e:any) => {
                        const { value } = e.target

                        const cinema = cinemas.find(c => c.id === value)
                        if (cinema !== undefined) 
                            setSelectedCinema(cinema)
                        else 
                            setSelectedCinema({...defCinema})
                    }}>
                        {
                            cinemas.sort((a,b) => a.city.name.localeCompare(b.city.name)).map((c,index) => 
                                <option key={index} value={c.id !== null ? c.id : ''}>{`${c?.city.name}, ${c?.street}, ${c?.houseNumber}`}</option>
                            )
                        }
                    </select>
                </div>
                <a href="/management/projections/new"><b>Nový</b></a>
            </div>
            <div className="sp-body">
                { filtredProjections.map((d,index) => { 
                    
                    const cinema = cinemas.find(c => Object.values(c.halls).find(h => h.id === d.hall.id) !== undefined)

                    const address = `${cinema?.city.name}, ${cinema?.street}, ${cinema?.houseNumber}`
                    const seats = Object.values(d.hall.seats).filter(s => s.seat).length - 1
                    const reserved = reservations.filter(r => r.projection.id === d.id).length - 1
                    
                    return <Tile key={index.toString()  }
                            header={d.film.name} 
                            onClick={()=>navigate(`/management/projections/${d.id}`)}
                            actions={
                                <input type='button' value='Odebrat' onClick={() => remove(d)} />
                            }
                            >
                            <>
                                <p><b>Multikino</b> {address}</p>
                                <p><b>Počet volných míst</b> {seats - reserved}</p>
                                <p><b>Míst celkem</b> {seats}</p>
                            </>
                        </Tile>
                    }) }
            </div>
        </div>
    )
}

export default ProjectionsSpreadsheet