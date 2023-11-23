import { useNavigate } from 'react-router-dom'
import './CinemasSpreadsheet.css'
import './Spreadsheet.css'
import { useEffect, useState } from 'react'
import Cinema from '../../../models/Cinema'
import { ModesEndpoints, deleteData, loadData } from '../../../global_functions/ServerAPI'
import Filter from '../../../components/management/Filter'
import Tile from '../../../components/management/Tile'

const defCinemas: Cinema[] = []

const CinemasSpreadsheet = () => {

    const navigate = useNavigate()
    const [cinemas, setCinemas] = useState([...defCinemas])
    const [filtredCinemas, setFiltredCinemas] = useState([...defCinemas])

    useEffect(() => {
        loadCinemas()
    }, [])

    useEffect(() => {
        setFiltredCinemas(cinemas)
    }, [cinemas])

    const loadCinemas = async () => {
        try {
            const cinemas = await loadData<Cinema>(ModesEndpoints.Cinama)

            setCinemas(cinemas)
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const remove = async (cinema: Cinema) => {
        try {
            deleteData<Cinema>(ModesEndpoints.Cinama, [cinema])

            loadCinemas()
        } catch (error) {
            console.log(error);
            throw error;
        }
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
            <div className="sp-header">
                <Filter filter={filter} />
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
                                <p><b>Sály</b> {Object.values(d.halls).map(h=>h.designation).join(", ")}</p>
                                <p>
                                    Počet sálů {Object.values(d.halls).length}.
                                </p>
                            </>
                        </Tile>
                    }) }
            </div>
        </div>
    )
}

export default CinemasSpreadsheet