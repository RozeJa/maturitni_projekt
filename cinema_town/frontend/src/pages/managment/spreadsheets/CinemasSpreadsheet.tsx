import { useNavigate } from 'react-router-dom'
import './CinemasSpreadsheet.css'
import { useEffect, useState } from 'react'
import Cinema from '../../../models/Cinema'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI'

const defCinemas: Cinema[] = []

const CinemasSpreadsheet = () => {

    const navigate = useNavigate()
    const [cinemas, setCinemas] = useState(defCinemas)

    useEffect(() => {
        loadCinemas()
    }, [])

    const loadCinemas = async () => {
        setCinemas(await loadData<Cinema>(ModesEndpoints.Cinama))
    }

    return (
        <div className='sp'>
            <div className="sp-header">
                <div className="filter">
                </div>
                <a href="/management/cinemas/new">new</a>
            </div>
            <div className="sp-body">
                <table>
                    <thead>
                        <tr>
                            <th>Město</th>
                            <th>Ulice</th>
                            <th>Číslo popisné</th>
                            <th>Počet sálů</th>
                            <th>Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        { cinemas.map((c) => {
                            return <tr key={c.id} onClick={()=>navigate(`/management/cinemas/${c.id}`)}>
                                <td>{c.city.name}</td>
                                <td>{c.street}</td>
                                <td>{c.houseNumber}</td>
                                <td>{c.halls !== null ? Object.values(c.halls).length : 0}</td>
                                <td>Odebrat</td>
                            </tr>
                        }) }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CinemasSpreadsheet