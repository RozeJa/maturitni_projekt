import DialogErr from '../../components/DialogErr';
import BlockBusters from '../../components/home/BlockBusters';
import { ModesEndpoints, loadData } from '../../global_functions/ServerAPI';
import Film from '../../models/Film';
import './Home.css'
import React, { useEffect, useState } from 'react';

// TODO udělán jen nástřel bude třeba sprovozdnit vyhledávací formulář a s tím i přidat logiku, že se zobrazují spíš promítání, než filmy

const defFilms: Film[] = [];

const Home = () => {

    const [films, setFilms] = useState([...defFilms])
    const [blockBusters, setBlockBusters] = useState([...defFilms])

    useEffect(() => {
        loadFilms()
        loadBlockBusters()
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

    const loadBlockBusters =async () => {
        try {
            const films = (await loadData<Film>(ModesEndpoints.FilmBlockBuster))
        
            setBlockBusters(films)
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
                    <input type="text" />
                    <p>Vyhledat</p>
                </div>
            </div>
            {/* filmy  */}
        </>
    )
}

export default Home