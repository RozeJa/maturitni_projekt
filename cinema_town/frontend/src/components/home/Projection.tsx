import Film from '../../models/Film'
import './Projection.css'
import { useState } from 'react'
import Trailer from './Trailer'

const Projection = ({
        film,
        i
    }: {
        film: Film,
        i: number
    }) => {

    const [trailer, setTrailer] = useState(<></>)

    return (
        <div className='projection'>
            {trailer}
            <h1 className='projection-responsive-header'><a href={`/film/${film.id}`}>{film.name}</a></h1>
            <div className="projection-content">
                <div className="projection-img"
                    onClick={() => setTrailer(<Trailer url={film.trailer} onClick={() => setTrailer(<></>)} />)}>
                    <img src={require(`../../assets/imgs/films-imgs/${film.id}/${film.picture}`)} alt={film.name}  />
                    <img src={require(`../../assets/imgs/favicons/play-favicon2.png`)} alt="favicon-play" />
                </div>
                <div className="projection-text-content">
                    <h1><a href={`/film/${film.id}`}>{film.name}</a></h1>
                    <div>
                        <p>{film.description}</p>
                    </div>
                    <div className="projection-text-content-actors">
                        <p><b>Věkové omezení:</b> {film.pg}+</p>
                        <p><b>Délka filmu:</b> {film.time} min.</p>
                        <p><b>Žánry: </b>{film.genres.map(g => g.name).join(", ")}</p>
                        <p><b>Režisér:</b> {`${film.director.surname} ${film.director.name}`}</p>
                        <p><b>Herci:</b> {Object.values(film.actors ? film.actors : {} ).map((a,i,arr) => `${a.surname} ${a.name}${i < (arr.length - 1) ? ", " : ""}`)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Projection