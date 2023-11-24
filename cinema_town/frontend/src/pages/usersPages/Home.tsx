import DialogErr from '../../components/DialogErr';
import BlockBusters from '../../components/home/BlockBusters';
import { ModesEndpoints, loadData } from '../../global_functions/ServerAPI';
import Cinema from '../../models/Cinema';
import Film from '../../models/Film';
import './Home.css'
import React, { useEffect, useState } from 'react';
import { defaultCinema } from '../../models/Cinema';
import ProjectionComponent from '../../components/home/Projection';
import Projection from '../../models/Projection';

// TODO udělán jen nástřel bude třeba sprovozdnit vyhledávací formulář a s tím i přidat logiku, že se zobrazují spíš promítání, než filmy

const defFilms: Film[] = []
const defCinemas: Cinema[] = [{...defaultCinema}]
const defProjections: Projection[] = []
const defAny: any = null

const Home = () => {

    const [films, setFilms] = useState([...defFilms])
    const [blockBusters, setBlockBusters] = useState([...defFilms])
    const [cinemas, setCinemas] = useState([...defCinemas])
    const [projections, setProjections] = useState([...defProjections])

    const [filtredProjections, setFiltredProjections] = useState([...defProjections])
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
            cinema.city.name = "Vyberte kino"

            cinemas.unshift(cinema)

            setCinemas(cinemas)
        } catch (err) {
            //console.log(err)
        }
    }

    const loadProjections = async () => {
        try {
            const projections = (await loadData<Projection>(ModesEndpoints.Projection))

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
                            return <option key={i} value={c.id !== null ? c.id : ""}>{`${c.city.name}, ${c.street}, ${c.houseNumber}`}</option>
                        })}
                    </select>
                    <div className="home-search-form-filter">
                        <input type="text" placeholder='Vyhledat' onChange={filter} />
                        <button>Vyhledat</button>
                    </div>
                </div>
            </div>
            {/* filmy  */}
            <div className="home-films">
                {
                    //films
                    filtredProjections.map(p => p.film)
                    .map((f, index) => {
                    return <ProjectionComponent key={index} film={f} i={index} />
                    })
                } 
                { 
                    filtredProjections.length === 0 ? <p>Jejda, pro tuto kombinaci kina a vyhledávání jsme nenašli žádná dostupná promítání.</p> : <></>
                }
            </div>
        </>
    )
}

export default Home