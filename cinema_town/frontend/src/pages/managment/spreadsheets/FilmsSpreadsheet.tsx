import { useNavigate } from 'react-router-dom'
import Film from '../../../models/Film'
import './FilmsSpreadsheet.css'
import './Spreadsheet.css'
import { useEffect, useState } from 'react'
import { ModesEndpoints, deleteData, loadData } from '../../../global_functions/ServerAPI'
import Genre, {defaultGerne} from '../../../models/Genre'
import Filter from '../../../components/management/Filter'
import Tile from '../../../components/management/Tile'

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

    useEffect(() => {
        load()
    }, [])

    useEffect(() => {
        setFiltredFilms(films)
    }, [films])

    useEffect(() => {
        filter(lastValue)
    }, [selectedGenre])

    const load = async () => {
        
        try {
            const films = (await loadData<Film>(ModesEndpoints.Film))

            setFilms(films)
        } catch (error) {
            console.log(error);
            throw error;
        }
        
        try {
            const genres = (await loadData<Genre>(ModesEndpoints.Genre))
            genres.unshift({...defGenre})

            setGenres(genres)
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const remove = async (film: Film) => {
        try {
            deleteData<Film>(ModesEndpoints.Film, [film])

            load()
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const filter = (e:any) => {
        if (e.target !== undefined) {
            const { value } = e.target 
    
            const newData = films.filter(f => {
                
                return ((
                    f.name.toLowerCase() === value.toLowerCase() ||
                    f.name.toLowerCase().split(value.toLowerCase()).length > 1) && (
                        selectedGenre.id === null ||
                        f.genres.find(g => g.id === selectedGenre.id)
                    )
                )
            })
            
            setLastValue(e)
            setFiltredFilms([...newData])   
        } else {
            const newData = films.filter(f => {
                
                console.log(selectedGenre.id);
                

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
            <div className="sp-header">
                <Filter filter={filter} />
                <div className='film-header-filter-genre'>
                    <label>Žánr : </label>
                    <select onChange={(e:any) => {
                        const { value } = e.target

                        const genre = genres.find(f => f.id === value)
                        if (genre !== undefined)
                            setSelectedGenre(genre) 
                        else 
                            setSelectedGenre({...defGenre})
                    }}>
                        {
                            genres.map((g,index) => 
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