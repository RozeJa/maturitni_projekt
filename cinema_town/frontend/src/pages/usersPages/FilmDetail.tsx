import { useNavigate, useParams } from 'react-router-dom'
import './FilmDetail.css'
import { useEffect, useState } from 'react'
import Film, { defaultFilm } from '../../models/Film'
import { ModesEndpoints, loadData } from '../../global_functions/ServerAPI'
import { handleErr, handleErrRedirect } from '../../global_functions/constantsAndFunction'
import TicketReservation from '../../components/filmDetail/TicketReservation'
import { getSessionStorageItem } from '../../global_functions/storagesActions'
import Projection from '../../models/Projection'

const defFilm: Film = defaultFilm

const FilmDetail = () => {

    const [film, setFilm] = useState({...defFilm})
    const [countOfProjections, setCountOfProjections] = useState(0)

    const [err, setErr] = useState(<></>)
    const [ticketReservation, setTicketReservation] = useState(<></>)

    const { fimlId } = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        loadData<Film>(ModesEndpoints.Film, [fimlId ? fimlId : 'undefined'])
            .then(data => {
                const film = data.shift();
                if (film !== undefined)
                    setFilm(film);
            })
            .catch(err => handleErrRedirect(setErr, err))
        loadData<Projection>(ModesEndpoints.ProjectionByFilm, [fimlId ? fimlId : 'undefined'])
            .then(data => {
                setCountOfProjections(data.length)
            })
            .catch(err => handleErrRedirect(setErr, err))
    }, [])

    return (
        <div className='film-detail'>
            {err}
            {ticketReservation}

            <div className="film-detail-header">
                <h1>{film.name}</h1>
                <button 
                    className={countOfProjections === 0 ? 'film-detail-header-deactivate' : 'film-detail-header-button'}
                    onClick={() => {
                        if (countOfProjections === 0)
                            return

                        if (getSessionStorageItem('loginToken') !== '') {
                            return setTicketReservation(<TicketReservation setTicketReservation={setTicketReservation} film={film} setErr={setErr} />)
                        } else {
                            navigate("/register")
                        }
                    }}>Zakoupit lístky</button>
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
                    <div>
                        <div className="film-detail-description-data-stat">
                            <p><b>Žánry</b></p>
                            <p>{Object.values(film.genres).map(g => g.name).join(', ')}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p><b>Režije</b></p>
                            <p>{`${film.director.surname} ${film.director.name}`}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p><b>Hrají</b></p>
                            <p>{Object.values(film.actors ? film.actors : {}).map(a => `${a.name} ${a.surname}`).join(', ')}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p><b>Původní znění</b></p>
                            <p>{film.original}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p><b>Promítáme v dabingu</b></p>
                            <p>{film.dabings.join(', ')}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p><b>Promítáme s titulkami</b></p>
                            <p>{film.titles.length > 0 ? film.titles.join(', ') : "Bez titulků"}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p><b>Délka filmu</b></p>
                            <p>{film.time} min</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p><b>Věkové omezení</b></p>
                            <p>{film.pg}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p><b>Produkce</b></p>
                            <p>{film.production}</p>
                        </div>
                        <div className="film-detail-description-data-stat">
                            <p><b>Premiéra</b></p>
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