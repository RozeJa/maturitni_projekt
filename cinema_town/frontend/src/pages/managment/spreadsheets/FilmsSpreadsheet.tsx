import { useNavigate } from 'react-router-dom'
import Film from '../../../models/Film'
import './FilmsSpreadsheet.css'
import './Spreadsheet.css'
import { useEffect, useState } from 'react'
import { ModesEndpoints, deleteData, loadData } from '../../../global_functions/ServerAPI'
import Genre, {defaultGerne} from '../../../models/Genre'
import Filter from '../../../components/management/Filter'
import Tile from '../../../components/management/Tile'
import { handleErr } from '../../../global_functions/constantsAndFunction'

const defFilms: Film[] = []
const defGenres: Genre[] = []
const defGenre: Genre = {...defaultGerne}
const FilmsSpreadsheet = () => {

    const navigate = useNavigate()
    const [films, setFilms] = useState([...defFilms])
    const [genres, setGenres] = useState([...defGenres])
    
    const [filtredFilms, setFiltredFilms] = useState([...defFilms])
    const [selectedGenre, setSelectedGenre] = useState({...defGenre})

    const [lastValue, setLastValue] = useState('')

    const [err, setErr] = useState(<></>)
    
    useEffect(() => {
        loadData<Film>(ModesEndpoints.Film)
            .then(data => {
                setFilms(
                    data.sort((a,b) => a.name.localeCompare(b.name))
                    )
            })
            .catch(err => handleErr(setErr, err))

        loadData<Genre>(ModesEndpoints.Genre)
            .then(data => {
                data.unshift({...defGenre})
                setGenres(data)
            })
            .catch(err => handleErr(setErr, err))
    }, [])

    useEffect(() => {
        setFiltredFilms(films)
    }, [films])

    useEffect(() => {
        filter(lastValue)
    }, [selectedGenre])

    const remove = (film: Film) => {
        deleteData<Film>(ModesEndpoints.Film, [film])
            .then(res => setFilms([...films.filter(d => d.id !== film.id)]))
            .catch(err => handleErr(setErr, err))
    }

    const filter = (e:any) => {
        if (e.target !== undefined) {
            const { value } = e.target 
    
            const newData = films.filter(f => {
                
                return ((
                    f.name.toLowerCase() === value.toLowerCase() ||
                    f.name.toLowerCase().split(value.toLowerCase()).length > 1 ||
                    f.defaultCost.toString().split(value).length > 1 ||
                    f.defaultCost == value ||
                    f.time == value ||
                    f.time.toString().split(value).length > 1) && (
                        selectedGenre.id === null ||
                        f.genres.find(g => g.id === selectedGenre.id)
                    )
                )
            })
            
            setLastValue(e)
            setFiltredFilms([...newData])   
        } else {
            const newData = films.filter(f => {
                
                return (
                    selectedGenre.id === null ||
                    f.genres.find(g => g.id === selectedGenre.id)
                )
            })
            setFiltredFilms([...newData]) 
        }
    }

    return (        
        <div className='sp'>
            {err}
            <div className="sp-header">
                <Filter filter={filter} />
                <div className='film-header-filter-genre'>
                    <h2>Filmy</h2>
                    <label>Žánr :</label>
                    <select onChange={(e:any) => {
                        const { value } = e.target

                        const genre = genres.find(f => f.id === value)
                        if (genre !== undefined)
                            setSelectedGenre(genre) 
                        else 
                            setSelectedGenre({...defGenre})
                    }}>
                        {
                            genres.sort((a,b) => a.name.localeCompare(b.name)).map((g,index) => 
                                <option key={index} value={g.id !== null ? g.id : ''}>{g.name}</option>
                            )
                        }
                    </select>
                </div>
                <a href="/management/films/new"><b>Nový</b></a>
            </div>
            <div className="sp-body">
                { filtredFilms.map((d,index) => { 

                    return <Tile key={index.toString()}
                            header={d.name} 
                            onClick={()=>navigate(`/management/films/${d.id}`)}
                            actions={
                                <input type='button' value='Odebrat' onClick={() => remove(d)} />
                            }
                            >
                            <>
                                <p><b>Režisér</b> {d.director.name} {d.director.surname}</p>
                                <p><b>Cena</b> {d.defaultCost} Kč</p>
                                <p><b>Doba trvání</b> {d.time} min</p>
                                <p><b>Věkové omezen</b> {d.pg} let</p>
                                <p><b>Dabingy</b> {d.dabings.join(", ")}</p>
                                <p><b>Titulky</b> {d.titles.join(", ")}</p>
                                <p><b>Blockbuster</b> {d.blockBuster ? "Ano" : "Ne"}</p>
                            </>
                        </Tile>
                    }) }
            </div>
        </div>
    )
}

export default FilmsSpreadsheet