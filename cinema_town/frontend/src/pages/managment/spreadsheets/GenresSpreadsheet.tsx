import { useEffect, useState } from 'react'
import Genre from '../../../models/Genre'
import './GenresSpreadsheet.css'
import './Spreadsheet.css'
import { ModesEndpoints, deleteData, loadData } from '../../../global_functions/ServerAPI'
import { useNavigate } from 'react-router-dom'
import Filter from '../../../components/management/Filter'
import Tile from '../../../components/management/Tile'

const defData: Genre[] = []
const GenresSpreadsheet = () => {

    const navigate = useNavigate()    
    const [data, setData] = useState(defData)
    const [filtredData, setFiltredData] = useState([...defData])

    useEffect(() => {
        load();
    }, [])

    useEffect(() => {
        setFiltredData(data)
    }, [data])

    const load = async () => {
        try {
            const genres = (await loadData<Genre>(ModesEndpoints.Genre))

            genres.sort((a,b) => a.name.localeCompare(b.name))

            setData(genres)
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const remove = async (genre: Genre) => {
        try {
            deleteData<Genre>(ModesEndpoints.Genre, [genre])

            load()
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const filter = (e:any) => {
        const { value } = e.target 

        const lowValue = value.toLowerCase()

        const newData = data.filter(d => d.name.toLowerCase() === lowValue || d.name.toLowerCase().split(lowValue).length > 1)
        
        setFiltredData([...newData])    
    }

    return (
        <div className='sp'>
            <div className="sp-header">
                <Filter filter={filter} />
                <a href="/management/genres/new"><b>Nový</b></a>
            </div>
            <div className="sp-body genres-sp-body">
                { filtredData.map((d,index) => {      
                    return <Tile key={index.toString()}
                            header={d.name} 
                            onClick={()=>navigate(`/management/genres/${d.id}`)}
                            actions={
                                <input type='button' value='Odebrat' onClick={() => remove(d)} />
                            }
                            >
                            <></>
                        </Tile>
                    }) }
            </div>
        </div>
    )
}

export default GenresSpreadsheet