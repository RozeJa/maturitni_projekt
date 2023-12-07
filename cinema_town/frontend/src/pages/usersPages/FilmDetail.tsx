import { useParams } from 'react-router-dom'
import './FilmDetail.css'
import { useEffect, useState } from 'react'
import Film, { defaultFilm } from '../../models/Film'
import { ModesEndpoints, loadData } from '../../global_functions/ServerAPI'
import { handleErr } from '../../global_functions/constantsAndFunction'

const defFilm: Film = defaultFilm

const FilmDetail = () => {

    const [film, setFilm] = useState({...defFilm})

    const [err, setErr] = useState(<></>)

    const { fimlId } = useParams()

    useEffect(() => {
        loadData<Film>(ModesEndpoints.Film, [fimlId ? fimlId : 'undefined'])
            .then(data => {
                const film = data.shift();
                if (film !== undefined)
                    setFilm(film);
            })
            .catch(err => handleErr(setErr, err))
    }, [])


    console.log(film);
    

    return (
        <div className='film-detail'>
            {err}

            <div className="film-detail-header">
                <h1>{film.name}</h1>
                <button>Zakoupit lístky</button>
            </div>
            <div className="film-detail-trailer">
                <iframe 
                src={`https://www.youtube.com/embed/${film.trailer}?hd=1&amp;wmode=transparent&amp;rel=0&amp;controls=1&amp;showinfo=0`} 
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen></iframe>
            </div>
            <div className="film-detail-description">
                <h2>{film.name}</h2>
                <p>{film.description}</p>
                <div className="film-detail-description-stats">
                    <div className="film-detail-description-data">
                        <div className="film-detail-description-data-stat">
                            <p>Žánry</p>
                            <p>{Object.values(film.genres).map(g => g.name).join(', ')}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p>Režíroval</p>
                            <p>{`${film.director.surname} ${film.director.name}`}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p>Hrají</p>
                            <p>{Object.values(film.actors ? film.actors : {}).map(a => `${a.surname} ${a.name}`).join(', ')}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p>Půvorni znění</p>
                            <p>{film.original}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p>Promítáme v dabingu</p>
                            <p>{film.dabings.join(', ')}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p>Promítáme s titulkami</p>
                            <p>{film.titles.length > 0 ? film.titles.join(', ') : "Bez titulků"}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p>Délka filmu</p>
                            <p>{film.time} min</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p>Věkové omezení</p>
                            <p>{film.pg}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p>Délka (v min.)</p>
                            <p>{film.time}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p>Produce</p>
                            <p>{film.production}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p>Premiéra</p>
                            <p>{(film.premier instanceof Date ? '' : film.premier.join(".   "))}</p>
                        </div>
                    </div>
                    <div className="film-detail-description-img">
                        {
                            film.id === null ? <></> : <img src={require(`../../assets/imgs/films-imgs/${film.id}/${film.picture}`)} alt={film.name}  />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilmDetail