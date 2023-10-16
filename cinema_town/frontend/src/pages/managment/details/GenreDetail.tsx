import { useNavigate, useParams } from 'react-router-dom'
import Genre, { defaultGerne } from '../../../models/Genre'
import './GenreDetail.css'
import { useEffect, useState } from 'react';
import { ModesEndpoints, loadData, storeData } from '../../../global_functions/ServerAPI'
import DialogErr from '../../../components/DialogErr';

const GenreDetail = () => {

    const { genreId } = useParams<string>()
    const [genre, setGenre] = useState<Genre>(defaultGerne);
    const [err, setErr] = useState(<></>)

    const navigate = useNavigate()
    
    
    useEffect(() => {
        if (typeof genreId === 'string') {
            loadGenre(genreId)
        }
        
    }, [])
    
    const handleChange = (event: any) => {
        const { name, value } = event.target

        setGenre({ ...genre, [name]: value })
    }

    const loadGenre = async (genreId: string) => {
        let genre = (await loadData<Genre>(ModesEndpoints.Genre, [genreId])).pop()
        if (genre !== undefined ) {
            setGenre(genre)
        }
    }
    const storeGenre = async () => {

        if (genre.name === '') {
            setErr(<DialogErr err='Název žánru musí byt vyplněný' description='Abyste mohly úspěšně odeslat formulář musíte vyplnit žázev žánru.' dialogSetter={setErr} />)
            return
        }

        try {
            await storeData<Genre>(ModesEndpoints.Genre, [genre]);

            navigate('/management/genres/')
        } catch (error) {
            // TODO dořešit přesnou chybu pro uživatele 
            setErr(<DialogErr err='Žánr se nepodařilo zapsat do datábáze' description='Přesné změní chyby nebylo dosud implementováno' dialogSetter={setErr} />)
        }
    }

    return (
        <div className='genre-detail'>
            {err}
            <h1>{genreId === undefined ? 'Nový žánr' : `Žánr: ${genre.name}`}</h1>
            <div className='genre-detail-body'>
                <label>Název žánru</label>
                <input name='name' type="text" placeholder='název žánru' onChange={handleChange} />
            </div>
            <div className='genre-detail-submit'>
                {genreId === undefined ? 
                    (<button onClick={()=>storeGenre()}>Vytvořit</button>) : 
                    (<button onClick={()=>storeGenre()}>Potvrdit změny</button>) 
                }
                <a href='/management/genres'>Zahodit změny</a>
            </div>
        </div>
    )
}

export default GenreDetail