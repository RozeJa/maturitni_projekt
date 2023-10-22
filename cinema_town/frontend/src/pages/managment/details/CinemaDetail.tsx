import { useEffect, useState } from 'react';
import Cinema from '../../../models/Cinema'
import City from '../../../models/City'
import './CinemaDetail.css'
import { ModesEndpoints, loadData, storeData } from '../../../global_functions/ServerAPI';
import DialogErr from '../../../components/DialogErr';
import { useNavigate } from 'react-router-dom';
import HallRecord from '../../../components/management/cinemaDetail/HallRecord';
import SelectInput from '../../../components/SelectInput';

export const validateCinema = (data: Cinema): Array<string> => {
    let errs: Array<string> = []

    if (data.city.name.trim() === '') {
        errs.push('Město musí být vyplněno.')
    }

    if (data.street.trim() === '') {
        errs.push('Ulice musí být vyplněno.')
    }

    if (data.houseNumber.trim() === '') {
        errs.push('Číslo popisné musí být vyplněno.')
    }

    return errs
}

let citiesDefault: City[] = []
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
    const [hallRecords, setHallRecords] = useState(hallRecordsDefault)
    const navigate = useNavigate()

    useEffect(() => {
        loadCities()
    }, [])


    const loadCities = async () => {
        try {
            let cities = (await loadData<City>(ModesEndpoints.City))
            
            setCities(cities)
        } catch (error) {
            setErr(
                setErr(<DialogErr err='Přístup odepřen' description={"Nemáte dostatečné oprávnění pro načtení měst"} dialogSetter={setErr} okText={<a href='/management/'>Ok</a>} />)
            )
        }
    }

    const storeAndRedirect = async () => {
        
        let errs: Array<string> = validateCinema(data)
        if (errs.length > 0) {
            let errLog: string = ''

            errs.forEach((err) => errLog += ` ${err}`);

            setErr(<DialogErr err='Chybně vyplněný formulář' description={errLog} dialogSetter={setErr} okText={'Ok'} />)
            return
        }

        try {
            let stored = await storeData<Cinema>(ModesEndpoints.Cinama, [data]);

            navigate(`/management/halls/${stored[0].id}/new`)
        } catch (error) {
            // TODO dořešit přesnou chybu pro uživatele 
            setErr(<DialogErr err='Nastala chyba při vkládání do db' description='Přesné změní chyby nebylo dosud implementováno' dialogSetter={setErr} okText={'ok'} />)
        }
    }

    if (data.halls !== null) {
        
        const maped = Array.from(data.halls).map(([key,hal]) => {
            return <HallRecord key={hal.id} hall={hal} cinema={data} setCinema={(newData: Cinema) => setData(newData)} />
        })

        setHallRecords(maped)
    }

    const handleCityChange = (e: any) => {
        const { value } = e.target

        data.city.name = value

        setData({ ...data })

        console.log(data);
        
    }

    return (
        <>
            <label>Město</label>
            <SelectInput options={cities.map((c: City) => c.name)} onChange={(event: any) => handleCityChange(event)} initValue={data.city.name} />
            <label>Ulice</label>
            <input name='street' type="text" value={data.street} onChange={(e: any) =>  handleInputText(e)} />
            <label>Číslo popisné</label>
            <input name='houseNumber' type="text" value={data.houseNumber} onChange={(e: any) =>  handleInputText(e)}/>
            <div className="cinema-detail-halls">
                <div className="cinema-detail-halls-header">
                    <h2>Sály kina</h2>
                    <p onClick={() => {
                        // pokud vytvářiš nový kino ulož ho 
                        if (data.id === null) {
                            storeAndRedirect()
                            // nebo přesměruj na stránku
                        } else {
                            navigate(`/management/halls/${data.id}/new`)
                        }
                
                    }}>Přidat sál</p>
                </div>
                {hallRecords}
            </div>
        </>
    )
}

export default CinemaDetail