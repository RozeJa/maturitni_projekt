import { useEffect, useState } from 'react'
import Genre from '../../../models/Genre'
import './GenresSpreadsheet.css'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI'
import { useNavigate } from 'react-router-dom'

const defData: Genre[] = []
const GenresSpreadsheet = () => {

    const navigate = useNavigate()    
    const [data, setData] = useState(defData)    

    useEffect(() => {
        load();
    }, [])

    const load = async () => {
        setData(await loadData<Genre>(ModesEndpoints.Genre))
    }

    return (
        <div className='sp'>
        <div className="sp-header">
            <div className="filter">
            </div>
            <a href="/management/genres/new">new</a>
        </div>
        <div className="sp-body">
            <table>
                <thead>
                    <tr>
                        <th>Žánr</th>
                        <th>Akce</th>
                    </tr>
                </thead>
                <tbody>
                    { data.map((d) => {     
                        return <tr key={d.id} onClick={()=>navigate(`/management/genres/${d.id}`)}>
                            <td>{d.name}</td>
                            <td>Odebrat</td>
                        </tr>
                    }) }
                </tbody>
            </table>
        </div>
    </div>
    )
}

export default GenresSpreadsheet