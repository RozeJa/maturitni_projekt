import { useEffect, useState } from 'react';
import Cinema from '../../../models/Cinema'
import City from '../../../models/City'
import './CinemaDetail.css'
import { ModesEndpoints, loadData, storeData } from '../../../global_functions/ServerAPI';
import DialogErr from '../../../components/DialogErr';
import { useNavigate } from 'react-router-dom';
import HallRecord from '../../../components/management/cinemaDetail/HallRecord';
import SelectInput from '../../../components/SelectInput';
import { handleErr, handleErrRedirect } from '../../../global_functions/constantsAndFunction';

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
const hallRecordsDefault = [<div key={-1} className='hall-record'/>]

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
    const [hallRecords, setHallRecords] = useState([...hallRecordsDefault])
    const navigate = useNavigate()

    useEffect(() => {
        loadData<City>(ModesEndpoints.City)
            .then(data => setCities(data))
            .catch(err => handleErrRedirect(setErr, err))
    }, [])

    useEffect(() => {
        if (data.halls !== null) {
        
            const maped = Object.values(data.halls).map((hal, index) => {
                return <HallRecord key={index} hall={hal} cinema={data} setCinema={(newData: Cinema) => setData(newData)} />
            })
            
            
           setHallRecords(maped)
        }
    }, [data])

    const storeAndRedirect = async () => {
        
        let errs: Array<string> = validateCinema(data)
        if (errs.length > 0) {
            let errLog: string = ''

            errs.forEach((err) => errLog += ` ${err}`);

            setErr(<DialogErr err='Chybně vyplněný formulář' description={errLog} dialogSetter={setErr} okText={'Ok'} />)
            return
        }

        storeData<Cinema>(ModesEndpoints.Cinama, [data])
            .then(data => navigate(`/management/halls/${data[0].id}/new`))
            .catch(err => handleErr(setErr, err))
    }

    const handleCityChange = (e: any) => {
        const { value } = e.target

        data.city.name = value

        setData({ ...data })
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
                <div className="cinema-detail-halls-body">
                    {hallRecords}
                </div>
            </div>
        </>
    )
}

export default CinemaDetail