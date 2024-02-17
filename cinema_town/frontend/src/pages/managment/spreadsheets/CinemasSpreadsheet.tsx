import { useNavigate } from 'react-router-dom'
import './CinemasSpreadsheet.css'
import './Spreadsheet.css'
import { useEffect, useState } from 'react'
import Cinema from '../../../models/Cinema'
import { ModesEndpoints, deleteData, loadData } from '../../../global_functions/ServerAPI'
import Filter from '../../../components/management/Filter'
import Tile from '../../../components/management/Tile'
import { handleErr } from '../../../global_functions/constantsAndFunction'

const defCinemas: Cinema[] = []

const CinemasSpreadsheet = () => {

    const navigate = useNavigate()
    const [cinemas, setCinemas] = useState([...defCinemas])
    const [filtredCinemas, setFiltredCinemas] = useState([...defCinemas])

    const [err, setErr] = useState(<></>)
    
    useEffect(() => {
        loadCinemas()
    }, [])

    useEffect(() => {
        setFiltredCinemas(cinemas)
    }, [cinemas])

    const loadCinemas = async () => {
        loadData<Cinema>(ModesEndpoints.Cinama)
            .then(data => setCinemas(data))
            .catch(err => handleErr(setErr, err))
    }

    const remove = (cinema: Cinema) => {
        deleteData<Cinema>(ModesEndpoints.Cinama, [cinema])
            .then(res => setCinemas([...cinemas.filter(d => d.id !== cinema.id)]))
            .catch(err => handleErr(setErr, err))
    }

    const filter = (e:any) => {
        const { value } = e.target 

        const newData = cinemas.filter(c => {
            
            const adress = (`${c.city.name}, ${c.street}, ${c.houseNumber}`).toLowerCase()
            const numberOfHalls = Object.values(c.halls).length.toString()


            return (
                adress === value.toLowerCase() ||
                adress.split(value.toLowerCase()).length > 1 ||
                adress.replaceAll(",", "") === value.toLowerCase() ||
                adress.replaceAll(",", "").split(value.toLowerCase()).length > 1 ||
                numberOfHalls === value ||
                numberOfHalls.split(value).length > 1
            )
        })
        
        setFiltredCinemas([...newData])    
    }

    return (
        <div className='sp'>
            {err}
            <div className="sp-header">
                <Filter filter={filter} />
                <p className='sp-header-title'>Správa multikin</p>
                <a href="/management/cinemas/new"><b>Nový</b></a>
            </div>
            <div className="sp-body">
                { filtredCinemas.map((d,index) => {     
                    const adress = `${d.city.name}, ${d.street}, ${d.houseNumber}`
                    return <Tile key={index.toString()}
                            header={adress} 
                            onClick={()=>navigate(`/management/cinemas/${d.id}`)}
                            actions={
                                <input type='button' value='Odebrat' onClick={() => remove(d)} />
                            }
                            >
                            <>
                                <p><b>Sály</b> {
                                    Object.values(d.halls)
                                        .sort((a,b) => a.designation.localeCompare(b.designation))
                                        .map(h=>h.designation).join(", ")}</p>
                                <p><b>Počet sálů</b> {Object.values(d.halls).length}</p>
                            </>
                        </Tile>
                    }) }
            </div>
        </div>
    )
}

export default CinemasSpreadsheet