import DialogErr from '../../components/DialogErr';
import BlockBusters from '../../components/home/BlockBusters';
import { ModesEndpoints, loadData } from '../../global_functions/ServerAPI';
import Cinema from '../../models/Cinema';
import Film from '../../models/Film';
import './Home.css'
import React, { useEffect, useState } from 'react';
import { defaultCinema } from '../../models/Cinema';

// TODO udělán jen nástřel bude třeba sprovozdnit vyhledávací formulář a s tím i přidat logiku, že se zobrazují spíš promítání, než filmy

const defFilms: Film[] = []
const defCinemas: Cinema[] = [{...defaultCinema}]

const Home = () => {

    const [films, setFilms] = useState([...defFilms])
    const [blockBusters, setBlockBusters] = useState([...defFilms])
    const [cinemas, SetCinemas] = useState([...defCinemas])

    useEffect(() => {
        loadFilms()
        loadBlockBusters()
        loadCinemas()
    }, [])
    useEffect(() => {
        
    }, [films, blockBusters])

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

            cinemas.unshift({...defaultCinema})

            SetCinemas(cinemas)
        } catch (err) {
            //console.log(err)
        }
    }

    return (
        <>
            {/* část kde se budou promítat aktuální trháky  */}
            <BlockBusters films={blockBusters} />
            {/* část s filtrem filmu */}
            <div className='home-search'>
                <h1>Program</h1>
                <select name="selectedCity" onSelect={() => {
                    // TODO
                }}>
                    {cinemas.map((c, i) => {
                        return <option key={i} value={c.id !== null ? c.id : ""}>{`${c.city.name} ${c.street} ${c.houseNumber}`}</option>
                    })}
                </select>
                <div className="home-search-form">
                    <input type="text" onChange={() => {
                        // TODO
                    }} />
                    <p>Vyhledat</p>
                </div>
            </div>
            {/* filmy  */}
            <div className="home-films">
                
            </div>
        </>
    )
}

export default Home