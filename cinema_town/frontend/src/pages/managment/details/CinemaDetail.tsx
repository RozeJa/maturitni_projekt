import { useEffect, useState } from 'react';
import Cinema from '../../../models/Cinema'
import City from '../../../models/City'
import './CinemaDetail.css'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI';
import DialogErr from '../../../components/DialogErr';
import HallRecord from '../../../components/management/cinemaDetail/HallRecord';
import Hall, { defaultHall } from '../../../models/Hall';
import HallEdit from '../../../components/management/cinemaDetail/HallEdit';

export const validateCinema = (data: Cinema): Array<string> => {
    let errs: Array<string> = []

    // TODO

    return errs
}

let citiesDefault: any = new Map<string, City>()
const hallRecordsDefault = [<></>]

const CinemaDetail = ({
    data, 
    handleInputText, 
    handleInputCheckbox, 
    setData, 
    setErr
}: {
    data: Cinema, 
    handleInputText: Function, 
    handleInputCheckbox: Function, 
    setData: Function, 
    setErr: Function
}) => {

    const [cities, setCities] = useState(citiesDefault)
    const [hallEdit, setHallEdit] = useState(<></>)
    const [hallRecords, setHallRecords] = useState(hallRecordsDefault)

    useEffect(() => {
        loadCities()
    }, [])


    const loadCities = async () => {
        try {
            let cities = (await loadData<City>(ModesEndpoints.City))
            
            setCities(cities)
        } catch (error) {
            setErr(
                setErr(<DialogErr err='Přístup odepřen' description={"Nemáte dostatečné oprávnění pro načtení měst"} dialogSetter={setErr} okText={<a href='/management/cinames/'>Ok</a>} />)
            )
        }
    }

    const removeHall = (hall: Hall) => {
        if (data.halls !== null) {
            setData({ ...data, ["halls"]: data.halls.filter((h) => h.id !== hall.id)})
        }
    }

    if (data.halls !== null) {
        const maped = data.halls.map((hall) => {
            return <HallRecord hall={hall} onClick={(h: Hall) => setHallEdit(
                <HallEdit hall={hall} close={() => setHallEdit(<></>)} addToCinema={(h: Hall) => {
                    if (data.halls !== null) {
                        let halls = data.halls.filter((hall) => hall.id !== h.id)
                        halls.push(h)
                        setData({ ...data, ["halls"]: halls})
                    }
                }}/>
            )} onDelete={(h: Hall) => removeHall(h)}/>
        })

        setHallRecords(maped)
    }

    return (
        <>
            {hallEdit}

            <label>Město</label>
            <input name='city-name' type="text" value={typeof data.city === 'string' ? cities[data.city] : data.city.name } />
            <label>Ulice</label>
            <input name='street' type="text" value={data.street} onChange={(e: any) =>  handleInputText(e)} />
            <label>Číslo popisné</label>
            <input name='houseNumber' type="text" value={data.houseNumber} onChange={(e: any) =>  handleInputText(e)}/>
            <div className="cinema-detail-halls">
                <div className="cinema-detail-halls-header">
                    <div></div>
                    <p onClick={() => {
                        setHallEdit(
                            <HallEdit hall={defaultHall} close={() => setHallEdit(<></>)} addToCinema={(h: Hall) => {                              
                                if (data.halls !== null) {
                                    let halls = data.halls
                                    halls.push(h)
                                    setData({ ...data, ["halls"]: halls})
                                }
                            }} />
                        )
                    }}>Přidat sál</p>
                </div>
                {hallRecords}
            </div>
        </>
    )
}

export default CinemaDetail