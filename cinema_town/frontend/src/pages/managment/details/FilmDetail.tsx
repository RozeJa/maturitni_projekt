import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Film from '../../../models/Film'
import './FilmDetail.css'
import People, { defaultPeople } from '../../../models/People'
import DialogErr from '../../../components/DialogErr'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI'
import PeopleInput from '../../../components/management/filmDetail/PeopleInput'
import { act } from '@testing-library/react'

export const validateFilm = (data: Film): Array<string> => {
    let errs: Array<string> = []

    // TODO

    return errs
}

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const defPeoples : People[] = []
const defPeople : People = defaultPeople
const defActors : { [key: string]: People }= {}

const FilmDetail = ({
    data, 
    handleInputText, 
    handleInputCheckbox, 
    setData, 
    setErr
}: {
    data: Film, 
    handleInputText: Function, 
    handleInputCheckbox: Function, 
    setData: Function, 
    setErr: Function
}) => {

    const { id } = useParams<string>()
    const [peoples, setPeoples] = useState(defPeoples)
    const [director, setDirector] = useState(defPeople)
    const [actors, setActors] = useState(defActors)
    const navigate = useNavigate()  
    
    useEffect(() => {
        loadPeoples()
    }, [])

    const loadPeoples = async () => {
        try {
            let peoples = (await loadData<People>(ModesEndpoints.People))

            setPeoples(peoples)
        } catch (error) {
            setErr(
                setErr(<DialogErr err='Přístup odepřen' description={"Nemáte dostatečné oprávnění pro načtení lidí"} dialogSetter={setErr} okText={<a href='/management/'>Ok</a>} />)
            )
        }
    }



    const handleNumberChange = (e: any) => {
        const { name, value } = e.target

        let val =  parseInt(value) 

        setData({ ...data, [name]: val > 0 ? val : 0 })
    }

    const handleDateChange = (e: any) => {
        const { name, value } = e.target
        setData({ ...data, [name]: new Date(value) });
    }

    return (
        <>
            <label>Název</label>
            <input name='name' type="text" value={data.name} onChange={(e: any) => handleInputText(e)}/>
            
            <label>Popis</label>
            <textarea name='description' cols={30} rows={10} />

            <label>Obrázek</label>
            <input type="file" onChange={(e: any) => console.log(e)} />

            <label>Trailer</label>
            <input name='trailer' type="text" value={data.trailer} onChange={(e: any) => handleInputText(e)}/>

            <label>Originální znění</label>
            <input name='original' type="text" value={data.original} onChange={(e: any) => handleInputText(e)}/>
            <div className='film-detail-checkbox'>
                <label>Použít pro prezenci</label>
                <input name='isBlockBuster' type="checkbox" checked={data.isBlockBuster} onChange={(e: any) => handleInputCheckbox(e)}/>                
            </div>

            <label>Režisér (příjmení a jméno)</label>
            <PeopleInput peoples={peoples} selected={director} onChange={(newDirector: People) => {

                console.log(newDirector);

                setDirector({ ...newDirector })
            }} />

            <label>Herci</label>
            <div className="actors">
                <div className="actors-header">
                    <div></div>
                    <input type="button" onClick={() => {
                        const newActors = { ...actors }
                        newActors[Object.keys(actors).length + 1] = defPeople
                        setActors(newActors)
                    }} value={'Přidat'} />
                </div>
                <div className="actors-body">
                    {
                        Object.keys(actors).map((key: string) => {
                            const selected: People = actors[key] as People;

                            return (
                                <div className="acount">
                                    <PeopleInput
                                        peoples={peoples}
                                        selected={selected}
                                        onChange={(p: People) => {
                                            const newActors = { ...actors }
                                            newActors[key] = p
                                            setActors(newActors)
                                        }}
                                    />
                                    <input type="button" onClick={() => {
                                            const newActors = { ...actors }
                                            delete newActors[key]
                                            setActors(newActors)
                                    }} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <label>Spadá do žánrů</label>

            <label>Dostupné titulky</label>

            <label>Dostupný dabing</label>

            <label>Délka trvání (v min)</label>
            <input name='time' type="number" value={data.time} onChange={handleNumberChange} />

            <label>Věková bariéra</label>
            <input name='pg' type="number" value={data.pg} onChange={handleNumberChange} />

            <label>Předpokládaná cena za lístek</label>
            <input name='defaultCost' type="number" value={data.defaultCost} onChange={handleNumberChange} />

            <label>Kdy byl film vydán</label>
            <input name='production' type="date" value={formatDate(data.production)} onChange={handleDateChange} />

            <label>Naše první promítání</label>
            <input name='premier' type="date" value={formatDate(data.premier)} onChange={handleDateChange} />
        </>
    )
}

export default FilmDetail