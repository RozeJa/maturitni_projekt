import { useEffect, useState } from 'react'
import Genre from '../../../models/Genre'
import './GenresSpreadsheet.css'
import './Spreadsheet.css'
import { ModesEndpoints, deleteData, loadData } from '../../../global_functions/ServerAPI'
import { useNavigate } from 'react-router-dom'
import Filter from '../../../components/management/Filter'
import Tile from '../../../components/management/Tile'
import { handleErr } from '../../../global_functions/constantsAndFunction'

const defData: Genre[] = []
const GenresSpreadsheet = () => {

    const navigate = useNavigate()    
    const [data, setData] = useState(defData)
    const [filtredData, setFiltredData] = useState([...defData])

    const [err, setErr] = useState(<></>)

    useEffect(() => {
        loadData<Genre>(ModesEndpoints.Genre)
            .then(data => {
                setData(
                    data.sort((a,b) => a.name.localeCompare(b.name))
                )
            })
            .catch(err => handleErr(setErr, err))
    }, [])

    useEffect(() => {
        setFiltredData(data)
    }, [data])

    const remove = (genre: Genre) => {
        deleteData<Genre>(ModesEndpoints.Genre, [genre])
            .then(res => setData([...data.filter(d => d.id !== genre.id)]))
            .catch(err => handleErr(setErr, err))
    }

    const filter = (e:any) => {
        const { value } = e.target 

        const lowValue = value.toLowerCase()

        const newData = data.filter(d => d.name.toLowerCase() === lowValue || d.name.toLowerCase().split(lowValue).length > 1)
        
        setFiltredData([...newData])    
    }

    return (
        <div className='sp'>
            {err}
            <div className="sp-header">
                <Filter filter={filter} />
                <h2>Žánry</h2>
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