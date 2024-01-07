import './Projection.css'
import { useState } from 'react'
import Trailer from './Trailer'
import ProjectioData from '../../models/Projection'

const Projection = ({
        projections,
        i,
        selectedCinemaId
    }: {
        projections: ProjectioData[],
        i: number,
        selectedCinemaId: string | null
    }) => {

    const [trailer, setTrailer] = useState(<></>)

    const film = projections[0].film
    const referal = `/film/${film.id}?cid=${selectedCinemaId}`

    console.log(projections);
    

    return (
        <div className='projection'>
            {trailer}
            <h1 className='projection-responsive-header'><a href={referal}>{film.name}</a></h1>
            <div className="projection-content">
                <div className="projection-img"
                    onClick={() => setTrailer(<Trailer url={film.trailer} onClick={() => setTrailer(<></>)} />)}>
                    <img src={require(`../../assets/imgs/films-imgs/${film.id}/${film.picture}`)} alt={film.name}  />
                    <img src={require(`../../assets/imgs/favicons/play-favicon2.png`)} alt="favicon-play" />
                </div>
                <div className="projection-text-content">
                    <h1><a href={referal}>{film.name}</a></h1>
                    <p>{film.description}</p>
                    <div className="projection-text-content-terms">
                        {                   
                            projections.map((p,index) => {

                                let date: string = ''

                                if (!(p.dateTime instanceof Date)){
                                    date = `${p.dateTime[3]+1}:${p.dateTime[4].toString().padStart(2, '0')}` 
                                }                                

                                return <a key={index} href={`${referal}&pid=${p.id}`}>{date}</a>
                            })
                        }
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