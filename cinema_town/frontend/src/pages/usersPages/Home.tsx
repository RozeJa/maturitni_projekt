import DialogErr from '../../components/DialogErr';
import BlockBusters from '../../components/home/BlockBusters';
import { ModesEndpoints, loadData } from '../../global_functions/ServerAPI';
import Cinema from '../../models/Cinema';
import Film from '../../models/Film';
import './Home.css'
import React, { useEffect, useState } from 'react';
import { defaultCinema } from '../../models/Cinema';
import Projection from '../../components/home/Projection';

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

            const cinema = {...defaultCinema}
            cinema.city.name = "Vyberte kino"

            cinemas.unshift(cinema)

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
                <div className="home-search-form">                
                    <select name="selectedCity" onSelect={() => {
                            // TODO
                        }}> 
                        {cinemas.map((c, i) => {
                            return <option key={i} value={c.id !== null ? c.id : ""}>{`${c.city.name} ${c.street} ${c.houseNumber}`}</option>
                        })}
                    </select>
                    <div className="home-search-form-filter">
                        <input type="text" onChange={() => {
                            // TODO
                        }} />
                        <button>Vyhledat</button>
                    </div>
                </div>
            </div>
            {/* filmy  */}
            <div className="home-films">
                {
                    films.map((f, index) => {
                        return <Projection key={index} film={f} i={index} />
                    })
                }
            </div>
        </>
    )
}

export default Home