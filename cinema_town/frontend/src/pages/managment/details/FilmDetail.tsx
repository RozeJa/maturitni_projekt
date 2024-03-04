import { useEffect, useState } from 'react'
import Film, { defaultFilm } from '../../../models/Film'
import './FilmDetail.css'
import People, { defaultPeople } from '../../../models/People'
import { ModesEndpoints, caseFile, loadData } from '../../../global_functions/ServerAPI'
import PeopleInput from '../../../components/management/filmDetail/PeopleInput'
import Genre, { defaultGerne } from '../../../models/Genre'
import { formatDate, handleErrRedirect } from '../../../global_functions/constantsAndFunction'
import SmartInput from '../../../components/SmartInput'
import BeautifulInput from '../../../components/BeautifulInput'
import { storeDetailData } from './Detail'

export const validateFilm = (data: Film): Array<string> => {
    let errs: Array<string> = []

    if (data.name.trim() === '')
        errs.push("Název filmu nesmí být nevyplněný.")
    if (data.original.trim() === '')
        errs.push("Původní dabing nesmí být nevyplněný.")
    if (data.original.length > 3) 
        errs.push("Původní znění musí být uvedeno jako zkratka (max 3 písmena).")
    if (data.dabings.length === 0) 
        errs.push("Film musí mít zadaný alespoň jeden dabing.")
    if (data.trailer !== '') {
        if (data.trailer.split("http").length > 1 || data.trailer.split("www").length > 1 || data.trailer.split("youtube").length > 1 || data.trailer.split("v=").length > 1) 
            errs.push("Trailer nemá být url adresa na video stačí pouze jeho id. Id nalednete na 'v='. Př: URL - https://www.youtube.com/watch?v=158aKdnWr7s Id - 158aKdnWr7s")
    }
    if (data.picture.trim() === '')
        errs.push("Obrázek filmu nesmí být nevyplněný.")
    if (data.genres.length === 0) 
        errs.push("Film musí být zařazen alespoň do jednoho žánru.")
    if (data.director.surname === '') 
        errs.push("I přes toleranci jmen zahraničních režisérů se vyžaduje alespoň příjmení režiséra.")
    if (data.time <= 0)
        errs.push("Naše společnost je otevřena sebekračím filmovým představením, ale tato doba musí být zapsána jako přirozené číslo.")
    if (data.time > 720)
        errs.push("Nejdelší film, který jsme ochotni vysílat musí být kratšší než 720 minut.")
    if (data.pg < 3) 
        errs.push("Nižší věkové omezení než 3 roky je pro ná nepřijatelné.")
    if (data.pg > 99) 
        errs.push("Věkové omezení nad 99 nemůže být uplatněno. Někde musí být hranice. Stoletý člověk už je dost starý na všechno.")
    if (data.defaultCost < 0) 
        errs.push("Naše společnost skutečně není charitní a nejnižší možná cena je 0 Kč.")

    return errs
}
const defPeoples : People[] = []
const defGenres : Genre[] = [{... defaultGerne}]
const defPeople : People = defaultPeople
const defActors : { [key: string]: People } = { '0': defPeople }

// TODO DOLADIT
// TODO předělat people input ať jako první bere jméno. (poslední slovo je příjmení ostatní spoj do jména)

const FilmDetail = ({
    data, 
    setErr
}: {
    data: Film,
    setErr: Function
}) => {
    
    const [tempData, setTempData] = useState(defaultFilm)
    useEffect(() => {
        setTempData(data)
        storeDetailData(tempData)
    }, [data])
    useEffect(() => {
        storeDetailData(tempData)        
    }, [tempData])

    const [peoples, setPeoples] = useState(defPeoples)
    const [genres, setGenres] = useState(defGenres)
    
    const [selectedGenres, setSelectedGenres] = useState([...defGenres])
    const [director, setDirector] = useState({ ...defPeople})
    const [actors, setActors] = useState(defActors)
    const [titles, setTitles] = useState([...tempData.titles, ""])
    const [dabings, setDabings] = useState([...tempData.dabings, ""])
    const [file, setFile] = useState(null)

    const [loaded, setLoaded] = useState(false)
    
    useEffect(() => {
        loadData<People>(ModesEndpoints.People)
            .then(data => setPeoples(data))
            .catch(err => handleErrRedirect(setErr, err))

        loadData<Genre>(ModesEndpoints.Genre)
            .then(data => {
                data.unshift(defaultGerne)
                setGenres(data)
            })
            .catch(err => handleErrRedirect(setErr, err))
    }, [])

    useEffect(() => {

        if (!loaded && tempData.id !== null) {
            setTitles([...tempData.titles, ""])
            setDabings([...tempData.dabings, ""])
            setSelectedGenres([...tempData.genres, {... defaultGerne}])
            setDirector(tempData.director)

            if (tempData.actors !== null) {
                const newActors: { [key: string]: People } = {}
                Object.values(tempData.actors).forEach((a) => {
                    newActors[Object.values(newActors).length.toString()] = a
                })

                newActors[Object.values(newActors).length.toString()] = {...defPeople}
                
                setActors({...newActors})
            }

            setLoaded(tempData.titles.length > 0 || tempData.dabings.length > 0)
        }

    }, [tempData])

    useEffect(() => {
        tempData["genres"] = selectedGenres.filter((v,i) => i !== selectedGenres.length - 1 && v.name !== "")
        setTempData({... tempData})
    }, [selectedGenres])
    useEffect(() => {
        tempData["director"] = director
        setTempData({... tempData})
    }, [director])
    useEffect(() => {
        const tempActors = {... actors}
        delete tempActors[Object.keys(tempActors)[Object.keys(tempActors).length - 1]]

        tempData["actors"] = tempActors
        setTempData({... tempData})
    }, [actors])
    useEffect(() => {
        tempData["titles"] = titles.filter((v,i) => i !== titles.length - 1 && v !== "")
        setTempData({... tempData})
    }, [titles])
    useEffect(() => {        
        tempData["dabings"] = dabings.filter((v,i) => i !== dabings.length - 1 && v !== "") 
        setTempData({... tempData})
    }, [dabings])
    useEffect(() => {
        if (file !== null) {
            setTempData({... tempData, ["picture"]: file["name"]})
            caseFile({... tempData, ["picture"]: file["name"], ["file"]: file})
        }
    }, [file])

    const handleNumberChange = (e: any) => {
        const { name, value } = e.target

        let val =  parseInt(value) 

        setTempData({ ...tempData, [name]: val > 0 ? val : 0 })
    }

    const handleDateChange = (e: any) => {
        const { name, value } = e.target
        
        setTempData({ ...tempData, [name]: new Date(value) });
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
                    if ((Object.values(actors).length - 1).toString() !== key)
                        delete actors[key]
                    
                    const newActors: { [key: string]: People } = {}

                    Object.values(actors).forEach((p,index) => {
                        newActors[index] = p
                    })
                    
                    
                    setActors({...newActors})
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
                                newActors[Object.keys(actors).length.toString()] = { id: Object.keys(actors).length.toString(), name: '', surname: ''}
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
   
    const renderGenres = selectedGenres.map((genre) => {
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

    const handleInputText = (e:any) => {
        const {name, value} = e.target

        setTempData({... tempData, [name]: value})
    }

    const handleInputCheckbox = (e:any) => {
        const {name, checked} = e.target

        setTempData({... tempData, [name]: checked})
    }

    return (
        <>
            <SmartInput label={'Název'}>
                <input 
                    name={'name'}
                    type={'text'}
                    value={tempData .name}
                    onChange={(e: any) => handleInputText(e)} />
            </SmartInput>
            
            <BeautifulInput label={'Popis'}>
                <textarea  className='film-detail-textarea'
                    name={'description'}
                    cols={30} rows={10}
                    value={tempData.description}
                    onChange={(e: any) => handleInputText(e)} />
            </BeautifulInput>

            <BeautifulInput label={`Obrázek ${(tempData.picture !== '' ? 'je vložen na servru' : '')}`}>
                <input type="file" onChange={(e: any) => {
                        setFile(e.target.files[0])
                    }} accept="image/jpeg, image/png, image/jpg" />
            </BeautifulInput>
            
            <SmartInput label={'Trailer (jen jeho YouTobe id)'}>
                <input 
                    name={'trailer'}
                    type={'text'}
                    value={tempData.trailer}
                    onChange={(e: any) => handleInputText(e)} />
            </SmartInput>  

            <SmartInput label={'Originální znění'}>
                <input 
                    name={'original'}
                    type={'text'}
                    value={tempData.original} 
                    onChange={(e: any) => handleInputText(e)} />
            </SmartInput>

            <div className='film-detail-checkbox'>
                <label>Použít pro prezenci</label>
                <input name='blockBuster' type="checkbox" checked={tempData.blockBuster} onChange={(e: any) => handleInputCheckbox(e)}/>                
            </div>

            <BeautifulInput label={'Režisér (jméno a příjmení)'}>
                <PeopleInput 
                    peoples={peoples} 
                    selected={director} 
                    onChange={(newDirector: People) => {
                        setDirector({ ...newDirector })
                    }} />
            </BeautifulInput>
           
            <BeautifulInput label={'Herci'}>
                <div>
                    { rendredActors }
                </div>
            </BeautifulInput>

            <BeautifulInput label={'Spadá do žánrů'}>
                <div className='film-detail-selects'>
                    { renderGenres }
                </div>
            </BeautifulInput>

            <BeautifulInput label={'Dostupné titulky'}>
                <div>
                    { renderTitles }
                </div>
            </BeautifulInput>


            <BeautifulInput label={'Dostupný dabing'}>
                <div>
                    { renderDabings }
                </div>
            </BeautifulInput>
            
            <SmartInput label={'Délka trvání (v min)'}>
                <input 
                    name={'time'}
                    type={'number'}
                    value={tempData.time} 
                    onChange={handleNumberChange} />
            </SmartInput>   

            <SmartInput label={'Věková bariéra'}>
                <input 
                    name={'pg'}
                    type={'number'}
                    value={tempData.pg} 
                    onChange={handleNumberChange} />
            </SmartInput>   

            <SmartInput label={'Předpokládaná cena za lístek'}>
                <input 
                    name={'defaultCost'}
                    type={'number'}
                    value={tempData.defaultCost} 
                    onChange={handleNumberChange} />
            </SmartInput>
            
            <SmartInput label={'Produkce'}>
                <input 
                    name={'production'}
                    type={'text'}
                    value={tempData.production} 
                    onChange={(e: any) => handleInputText(e)} />
            </SmartInput>

            <SmartInput label={'Premiéra'}>
                <input 
                    name={'premier'}
                    type={'date'}
                    value={formatDate(tempData.premier)} 
                    onChange={handleDateChange} />
            </SmartInput>
        </>
    )
}

export default FilmDetail