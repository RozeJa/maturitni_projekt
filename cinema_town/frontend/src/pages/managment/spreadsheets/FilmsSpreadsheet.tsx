import { useNavigate } from 'react-router-dom'
import Film from '../../../models/Film'
import './FilmsSpreadsheet.css'
import { useEffect, useState } from 'react'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI'
import Genre from '../../../models/Genre'

const defFilms: Film[] = []
const defGenres: Genre[] = []
const FilmsSpreadsheet = () => {

    const navigate = useNavigate()
    const [films, setFilms] = useState(defFilms)
    const [genres, setGenres] = useState(defGenres)

    useEffect(() => {
        load()
    }, [])

    const load = async () => {
        setFilms(await loadData<Film>(ModesEndpoints.Film))
        setGenres(await loadData<Genre>(ModesEndpoints.Genre))
    }

    return (        
        <div className='fsp'>
            <div className="fsp-header">
                <div className="filter">
                </div>
                <a href="/management/films/new">new</a>
            </div>
            <div className="fsp-body">
                <table>
                    <thead>
                        <tr>
                            <th>Název</th>
                            <th>Použit pro prezenci</th>
                            <th>Režisér</th>
                            <th>Doba trvání (v min.)</th>
                            <th>Věkové omezení</th>
                            <th>Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        { films.map((f) => {
                            return <tr key={f.id} onClick={()=>navigate(`/management/films/${f.id}`)}>
                                <td>{f.name}</td>
                                <td>{f.blockBuster ? "Ano" : "Ne"}</td>
                                <td>{`${f.director.surname} ${f.director.name}`}</td>
                                <td>{f.time}</td>
                                <td>{f.pg}</td>
                                <td>Odebrat</td>
                            </tr>
                        }) }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default FilmsSpreadsheet