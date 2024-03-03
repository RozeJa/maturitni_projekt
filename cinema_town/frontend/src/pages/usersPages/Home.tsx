import BlockBusters from '../../components/home/BlockBusters';
import { ModesEndpoints, loadData } from '../../global_functions/ServerAPI';
import Cinema from '../../models/Cinema';
import Film from '../../models/Film';
import './Home.css'
import { useEffect, useState } from 'react';
import { defaultCinema } from '../../models/Cinema';
import Projection from '../../models/Projection';
import DaySelection from '../../components/home/DaySelection';
import ProjectionGroup from '../../components/home/ProjectionGroup';

const defFilms: Film[] = []
const defCinemas: Cinema[] = [{...defaultCinema}]
const defProjections: Projection[] = []
const defAny: any = null
const defGroups: { [key: string]: Projection[][] } = {}
const defSections: { [key: number]: string } = {}

const Home = () => {

    const [films, setFilms] = useState([...defFilms])
    const [blockBusters, setBlockBusters] = useState([...defFilms])
    const [cinemas, setCinemas] = useState([...defCinemas])
    const [projections, setProjections] = useState([...defProjections])

    const [filtredProjections, setFiltredProjections] = useState([...defProjections])
    const [projectionsGroups, setProjectionGroups] = useState({...defGroups})
    const [sections, setSections] = useState({...defSections})
    const [selectedCinema, setSelectedCinema] = useState({...defaultCinema})
    const [lastEvent, setLastEvent] = useState(defAny)

    useEffect(() => {
        loadFilms()
        loadBlockBusters()
        loadCinemas()
        loadProjections()
    }, [])
    useEffect(() => {
        filter(lastEvent)
    }, [films, blockBusters])

    useEffect(() => {
        setFiltredProjections(projections)
    }, [projections])

    useEffect(() => {
        filter(lastEvent)
    }, [selectedCinema])
    useEffect(() => {
        const groups: { [key: string]: Projection[][] } = {}
        const sections = {...defSections}

        filtredProjections.forEach(p => {
            if (!(p.dateTime instanceof Date)) {
                
                if (groups[`${p.dateTime[1]}#${p.dateTime[2]}`] === undefined) {
                    sections[parseInt(p.dateTime[2])] = '#' + p.dateTime[2]
                    groups[`${p.dateTime[1]}#${p.dateTime[2]}`] = [[p]]
                } else {
                    groups[`${p.dateTime[1]}#${p.dateTime[2]}`].map(arr => {
                        if (arr[0].film.id === p.film.id)
                            arr.push(p)
                        return arr
                    })
                }
            }
        })
        
        setSections(sections)
        setProjectionGroups(groups)
    }, [filtredProjections])

    const loadFilms = async () => {
        try {
            const films = (await loadData<Film>(ModesEndpoints.Film))
            
            setFilms(films)
        } catch (err) {
            //console.log(err)
        }
    }

    const loadBlockBusters = async () => {
        try {
            const films = (await loadData<Film>(ModesEndpoints.FilmBlockBuster))
        
            setBlockBusters(films)
        } catch (err) {
            //console.log(err)
        }
    }

    const loadCinemas = async () => {
        try {
            const cinemas = (await loadData<Cinema>(ModesEndpoints.Cinama))

            const cinema = {...defaultCinema}
            cinema.city.name = "Všechna kina"

            cinemas.unshift(cinema)

            setCinemas(cinemas)
        } catch (err) {
            //console.log(err)
        }
    }

    const loadProjections = async () => {
        try {
            const projections = (await loadData<Projection>(ModesEndpoints.Projection))
            .filter(p => {
                if (p.dateTime instanceof(Date))
                    return true
    
                const date = new Date()
                date.setDate(date.getDate() + 13)
    
                const term = new Date(parseInt(p.dateTime[0]), parseInt(p.dateTime[1])-1, parseInt(p.dateTime[2]))
    
                const utcDiference = new Date(date.getTime() - term.getTime())
    
                return utcDiference.getDate() <= 14 && utcDiference.getMonth() === 0
            })
            
            setProjections(projections)
        } catch (err) {
            //console.log(err)
        }
    }

    const filter = (e:any) => {
        if (e !== null) {
            const { value } = e.target 
            
            const newData = projections.filter(p => ((
                p.film.name.toLowerCase() === value.toLowerCase() ||
                p.film.name.toLowerCase().split(value.toLowerCase()).length > 1 || 
                p.film.genres.filter(g => 
                    g.name.toLowerCase() === value.toLowerCase() || 
                    g.name.toLowerCase().split(value.toLowerCase()).length > 1
                ).length > 0) && (
                    selectedCinema.id === null ||
                    Object.values(selectedCinema.halls).find(h => h.id === p.hall.id) !== undefined 
                )))

            setFiltredProjections(newData)
        } else {
            const newData = projections.filter(p => (
                selectedCinema.id === null ||
                Object.values(selectedCinema.halls).find(h => h.id === p.hall.id) !== undefined 
            ))

            setFiltredProjections(newData)
        }
        setLastEvent(e)
    }

    return (
        <>
            {/* část kde se budou promítat aktuální trháky  */}
            <BlockBusters films={blockBusters} />
            {/* část s filtrem filmu */}
            <div className='home-search'>
                <h1>Program</h1>
                <div className="home-search-form">                
                    <select name="selectedCity" onChange={(e:any) => {
                        const { value } = e.target

                        const cinema =  cinemas.find(c => c.id === value)

                        if (cinema !== undefined)
                            setSelectedCinema(cinema)
                        else 
                            setSelectedCinema({...defaultCinema})
                    }}> 
                        {cinemas.map((c, i) => {
                            return <option key={i} value={c.id !== null ? c.id : ""}>{c.city.name === 'Všechna kina' ? 'Všechna kina' : `${c.city.name}, ${c.street}, ${c.houseNumber}`}</option>
                        })}
                    </select>
                    <div className="home-search-form-filter">
                        <input type="text" placeholder='Vyhledat' onChange={filter} />
                        <button>Vyhledat</button>
                    </div>
                </div>
            </div>
            {/* část s kalendářem */}
            <DaySelection sections={sections} />
            {/* filmy  */}
            <div className="home-films">
                {
                    //films
                    //filtredProjections.sort((a,b) => a.film.name.localeCompare(b.film.name)).map(p => p.film)
                    //.map((f, index) => {
                    //return <ProjectionComponent key={index} film={f} i={index} />
                    //})
                    Object.keys(projectionsGroups).sort((a,b) => a.localeCompare(b)).map(((pg, index) => 
                        <ProjectionGroup key={index} projections={projectionsGroups[pg]} month={parseInt(pg.split("#")[0])} day={parseInt(pg.split("#")[1])} selectedCinemaId={selectedCinema.id} />
                    ))
                } 
                { 
                    filtredProjections.length === 0 ? <p>Jejda, pro tuto kombinaci kina a vyhledávání jsme nenašli žádná dostupná promítání.</p> : <></>
                }
            </div>
        </>
    )
}

export default Home