import { useNavigate } from 'react-router-dom'
import Film from '../../models/Film'
import './Projection.css'

const Projection = ({
        film,
        i
    }: {
        film: Film,
        i: number
    }) => {

    const navigate = useNavigate()

    return (
        <div className='projection'>
            <h1 className='projection-responsive-header'
                onClick={() => navigate(`/film/${film.id}`)}
                >{film.name}
            </h1>
            <div className="projection-content">
                <div className="projection-img">
                    <img src={require(`../../assets/imgs/films-imgs/${film.id}/${film.picture}`)} alt={film.name}  />
                </div>
                <div className="projection-text-content">
                    <h1 
                        onClick={() => navigate(`/film/${film.id}`)}
                        >{film.name}
                    </h1>
                    <div>
                        <p>{film.description}</p>
                    </div>
                    <div className="projection-text-content-actors">
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