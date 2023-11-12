import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Film from '../../../models/Film'
import './FilmDetail.css'
import People, { defaultPeople } from '../../../models/People'
import DialogErr from '../../../components/DialogErr'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI'
import PeopleInput from '../../../components/management/filmDetail/PeopleInput'
import Genre, { defaultGerne } from '../../../models/Genre'

export const validateFilm = (data: Film): Array<string> => {
    let errs: Array<string> = []

    // TODO

    return errs
}

const formatDate = (date: Date | string[]): string => {
    
    let year
    let month 
    let day 
    if (date instanceof Date) {
        year = date.getFullYear()
        month = (date.getMonth() + 1).toString().padStart(2, '0')
        day = date.getDate().toString().padStart(2, '0')
    } else {
        const objData = new Date(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]))
        year = objData.getFullYear()
        month = (objData.getMonth() + 1).toString().padStart(2, '0')
        day = objData.getDate().toString().padStart(2, '0')
    }
        
    return `${year}-${month}-${day}`;
}

const defPeoples : People[] = []
const defGenres : Genre[] = [{... defaultGerne}]
const defPeople : People = defaultPeople
const defActors : { [key: string]: People } = { '0': defPeople }
const defTitles : string[] = [""]
const defDabings : string[] = [""]

// TODO DOLADIT
// TODO předělat people input ať jako první bere jméno. (poslední slovo je příjmení ostatní spoj do jména)

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
    const [genres, setGenres] = useState(defGenres)
    
    const [selectedGenres, setSelectedGenres] = useState([...defGenres])
    const [director, setDirector] = useState({ ...defPeople})
    const [actors, setActors] = useState(defActors)
    const [titles, setTitles] = useState([...data.titles, ""])
    const [dabings, setDabings] = useState([...data.dabings, ""])
    const [file, setFile] = useState(null)

    const [loaded, setLoaded] = useState(false)
    
    useEffect(() => {
        loadPeoples()
        loadGenres()
    }, [])

    useEffect(() => {

        if (!loaded && data.id !== null) {
            setTitles([...data.titles, ""])
            setDabings([...data.dabings, ""])
            setSelectedGenres([...data.genres, {... defaultGerne}])
            setDirector(data.director)

            if (data.actors !== null) {
                const newActors: { [key: string]: People } = {}
                Object.values(data.actors).forEach((a) => {
                    newActors[Object.values(newActors).length.toString()] = a
                })

                newActors[Object.values(newActors).length.toString()] = {...defPeople}
                
                setActors({...newActors})
            }

            setLoaded(data.titles.length > 0 || data.dabings.length > 0)
        }

    }, [data])

    useEffect(() => {
        data["genres"] = selectedGenres.filter((v,i) => i !== selectedGenres.length - 1 && v.name !== "")
        setData({... data})
    }, [selectedGenres])
    useEffect(() => {
        data["director"] = director
        setData({... data})
    }, [director])
    useEffect(() => {
        const tempActors = {... actors}
        delete tempActors[Object.keys(tempActors)[Object.keys(tempActors).length - 1]]

        data["actors"] = tempActors
        setData({... data})
    }, [actors])
    useEffect(() => {
        data["titles"] = titles.filter((v,i) => i !== titles.length - 1 && v !== "")
        setData({... data})
    }, [titles])
    useEffect(() => {        
        data["dabings"] = dabings.filter((v,i) => i !== dabings.length - 1 && v !== "") 
        setData({... data})
    }, [dabings])
    useEffect(() => {
        if (file !== null)
            setData({... data, ["file"]: file, ["picture"]: file["name"]})
    }, [file])

    const loadPeoples = async () => {
        try {
            let peoples = (await loadData<People>(ModesEndpoints.People))

            setPeoples(peoples)
        } catch (error) {
            setErr(
                setErr(<DialogErr err='Přístup odepřen' description={"Nemáte dostatečné oprávnění pro načtení lidí."} dialogSetter={setErr} okText={<a href='/management/'>Ok</a>} />)
            )
        }
    }
    const loadGenres = async () => {
        try {
            let genres = (await loadData<Genre>(ModesEndpoints.Genre))
            genres.unshift(defaultGerne)

            setGenres(genres)
        } catch (error) {
            setErr(
                setErr(<DialogErr err='Přístup odepřen' description={"Nemáte dostatečné oprávnění pro načtení žánrů."} dialogSetter={setErr} okText={<a href='/management/'>Ok</a>} />)
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

    //console.log("director",director);  
    //console.log("actors",actors);    
    const rendredActors = Object.keys(actors).map((key: string) => {
            const selected: People = actors[key] as People;

            const remove = <input 
                key={key+"input"}
                value="x"
                type="button" 
                onClick={() => {
                    const newActors = { ...actors }
                    delete newActors[key]
                    setActors(newActors)
            }} />
            
            return (
                <div key={key+"peopleInput"} className="film-detail-multiple">
                    <PeopleInput
                        key={key+"peopleInput komp"}
                        peoples={peoples}
                        selected={selected}
                        onChange={(p: People) => {
                            const newActors = { ...actors }
                            newActors[key] = p
                                    
                            if (newActors[(Object.keys(actors).length-1).toString()].surname !== '') {
                                newActors[Object.keys(actors).length.toString()] = { id: null, name: '', surname: ''}
                                setActors({ ...newActors})
                            } else {
                                setActors(newActors)
                            }
                        }}
                    />

                    { key !== '0' ? remove : <></> }
                </div>
            )
        })
   
    const renderGenres = selectedGenres.map(genre => {
        const keys: {[key: string]: string} = {} 

        const options = genres.map((g,i) => {

            const index = genre.id === g.id ? i : ''

            keys[(g.id ? g.id : '')] = (g.id ? g.id : '') + " " + index

            return <option key={`${g.id !== null ? g.id : ""} option`} value={keys[(g.id ? g.id : '')]}>{g.name}</option>
        })

        const remove = <input 
                        key={(genre.id !== null ? genre.id : "genreId") + "input"}
                        value="x"
                        type="button" 
                        onClick={() => {
                            
                            const newSelectedGenres = selectedGenres.filter(g =>  g.id === '' || g.id !== genre.id)
                            setSelectedGenres([... newSelectedGenres ])
                    }} />

        return <div className='film-detail-multiple' key={(genre.id !== null ? genre.id : '') + 'genres'}  >
            <select 
                key={(genre.id !== null ? genre.id : '') + 'select genre'} 
                value={keys[genre.id ? genre.id : '']}
                onChange={(e: any) => {

                    const {value} = e.target
                    
                    const id = value.split(" ")[0]
                    const index = !Number.isNaN(parseInt(value.split(" ")[1])) ? parseInt(value.split(" ")[1]) : selectedGenres.length - 1
                     
                    const newGenre = genres.find((g) => {
                        return g.id === id
                    })

                    if (newGenre !== undefined) {
                        selectedGenres[index] = newGenre

                        selectedGenres.push({... defaultGerne})
                        const newSelectedGenres = selectedGenres.filter((value, index, array) => {
                            return array.indexOf(value) === index;
                          })
                        setSelectedGenres([... newSelectedGenres ])
                    } 

                }}> { options } </select>
            
            { genre.id !== null ? remove : <></> }
        </div> 
    })

    const renderTitles = titles.map((title, i) => {
        return <div key={title} className="film-detail-multiple">
            <input
                type='text'
                value={title}
                autoFocus={title !== ''}
                onChange={(e: any) => {
                    if (titles.find(title => title === e.target.value) === undefined || e.target.value === '') {
                        titles[i] = e.target.value;

                        if (titles[i] === "") {
                            const newTitles = titles.filter((v,index) => i !== index)
            
                            setTitles([... newTitles])
                        } else {
                            if (titles[titles.length - 1].trim() !== '') {
                                titles[titles.length] = ''
                            }
                            setTitles([... titles])
                        } 
                    }
                }}
            />
        </div>
    })
    
    const renderDabings = dabings.map((dabing, i) => {
        return <div key={dabing} className="film-detail-multiple">
            <input
                type='text'
                value={dabing}
                autoFocus={dabing !== ''}
                onChange={(e: any) => {
                    if (dabings.find(dabing => dabing === e.target.value) === undefined || e.target.value === '') {
                        dabings[i] = e.target.value;

                        if (dabings[i] === "") {
                            const newDabings = dabings.filter((v,index) => i !== index)
            
                            setDabings([... newDabings])
                        } else {
                            if (dabings[dabings.length - 1].trim() !== '') {
                                dabings[dabings.length] = ''
                            }
                            setDabings([... dabings])
                        } 
                    }
                }}
            />
        </div>
    })

    return (
        <>
            <label>Název</label>
            <input name='name' type="text" value={data.name} onChange={(e: any) => handleInputText(e)}/>
            
            <label>Popis</label>
            <textarea name='description' value={data.description} cols={30} rows={10} onChange={(e: any) => handleInputText(e)} />

            <label>Obrázek</label>
            <input type="file" onChange={(e: any) => setFile(e.target.files[0])} />

            <label>Trailer</label>
            <input name='trailer' type="text" value={data.trailer} onChange={(e: any) => handleInputText(e)}/>

            <label>Originální znění</label>
            <input name='original' type="text" value={data.original} onChange={(e: any) => handleInputText(e)}/>
            <div className='film-detail-checkbox'>
                <label>Použít pro prezenci</label>
                <input name='blockBuster' type="checkbox" checked={data.blockBuster} onChange={(e: any) => handleInputCheckbox(e)}/>                
            </div>

            <label>Režisér (příjmení a jméno)</label>
            <PeopleInput 
                peoples={peoples} 
                selected={director} 
                onChange={(newDirector: People) => {
                    setDirector({ ...newDirector })
                }} />
           
            <label>Herci</label>
            <div>
                { rendredActors }
            </div>

            <label>Spadá do žánrů</label>
            <div>
                { renderGenres }
            </div>

            <label>Dostupné titulky</label>
            <div>
                { renderTitles }
            </div>

            <label>Dostupný dabing</label>
            <div>
                { renderDabings }
            </div>

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