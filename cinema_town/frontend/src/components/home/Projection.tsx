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
            <div className="projection-img">
                <img src={require(`../../assets/imgs/films-imgs/${film.id}/${film.picture}`)} alt={film.name}  />
            </div>
            <div className="projection-text-content">
                <div className="">
                    <h1 
                        onClick={() => navigate(`/film/${film.id}`)}
                        >{film.name}
                    </h1>
                    <p>{film.description}</p>
                </div>
                <div className="projection-text-content-actors">
                    <p><b>Režisér:</b> {`${film.director.surname} ${film.director.name}`}</p>
                    <p><b>Herci:</b> {Object.values(film.actors ? film.actors : {} ).map((a,i,arr) => `${a.surname} ${a.name}${i < (arr.length - 1) ? ", " : ""}`)}</p>
                </div>

            </div>
        </div>
    )
}

export default Projection