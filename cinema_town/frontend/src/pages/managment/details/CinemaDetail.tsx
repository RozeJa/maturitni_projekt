import { useEffect, useState } from 'react';
import Cinema, { defaultCinema } from '../../../models/Cinema'
import City from '../../../models/City'
import './CinemaDetail.css'
import { ModesEndpoints, loadData, storeData } from '../../../global_functions/ServerAPI';
import DialogErr from '../../../components/DialogErr';
import { useNavigate } from 'react-router-dom';
import HallRecord from '../../../components/management/cinemaDetail/HallRecord';
import SelectInput from '../../../components/SelectInput';
import { handleErr, handleErrRedirect } from '../../../global_functions/constantsAndFunction';
import SmartInput from '../../../components/SmartInput';
import BeautifulInput from '../../../components/BeautifulInput';
import Hall from '../../../models/Hall';
import { storeDetailData } from './Detail';

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
const defHalls: Hall[] = []

const CinemaDetail = ({
    data, 
    setErr
}: {
    data: Cinema, 
    setErr: Function
}) => {

    const [tempData, setTempData] = useState(defaultCinema)
    useEffect(() => {
        setTempData(data)
        storeDetailData(tempData)
    }, [data])
    useEffect(() => {
        storeDetailData(tempData)
    }, [tempData])

    const [cities, setCities] = useState(citiesDefault)
    const [hallRecords, setHallRecords] = useState([...hallRecordsDefault])
    const [unremovableHalls, setUnremovablrHalls] = useState([...defHalls])
    const navigate = useNavigate()

    useEffect(() => {
        loadData<City>(ModesEndpoints.City)
            .then(data => setCities(data))
            .catch(err => handleErrRedirect(setErr, err))
    }, [])

    useEffect(() => {
        if (tempData.halls !== null) {
        
            const maped = Object.values(tempData.halls)
            .sort((a,b) => a.designation.localeCompare(b.designation))
            .map((hal, index) => {
                return <HallRecord key={index} hall={hal} cinema={tempData} unremovableHalls={unremovableHalls} setCinema={(newData: Cinema) => setTempData(newData)} />
            })
            
            
           setHallRecords(maped)
        }
    }, [unremovableHalls, tempData])

    useEffect(() => {
        if (tempData.id !== null)
            loadData<Hall>(ModesEndpoints.HallsUnremovable, [tempData.id])
                .then(data => setUnremovablrHalls(data))
                .catch(err => handleErrRedirect(setErr, err))
    }, [tempData])

    const storeAndRedirect = async () => {
        
        let errs: Array<string> = validateCinema(tempData)
        if (errs.length > 0) {
            let errLog: string = ''

            errs.forEach((err) => errLog += ` ${err}`);

            setErr(<DialogErr err='Chybně vyplněný formulář' description={errLog} dialogSetter={setErr} okText={'Ok'} />)
            return
        }

        storeData<Cinema>(ModesEndpoints.Cinama, [tempData])
            .then(data => navigate(`/management/halls/${data[0].id}/new`))
            .catch(err => handleErr(setErr, err))
    }

    const handleCityChange = (e: any) => {
        const { value } = e.target

        tempData.city.name = value

        setTempData({ ...data })
    }

    const handleInputText = (e:any) => {
        const {name, value} = e.target

        setTempData({... tempData, [name]: value})
    }

    return (
        <>            
            <BeautifulInput label='Město'>
                <SelectInput options={cities.map((c: City) => c.name)} onChange={(event: any) => handleCityChange(event)} initValue={tempData.city.name} />
            </BeautifulInput>
           
            <SmartInput label={'Ulice'}>
                <input 
                    name={'street'}
                    type={'text'}
                    value={tempData.street}
                    onChange={(e: any) => handleInputText(e)}/>    
            </SmartInput> 
            
            <SmartInput label={'Číslo popisné'}>
                <input 
                    name={'houseNumber'}
                    type={'text'}
                    value={tempData.houseNumber}
                    onChange={(e: any) => handleInputText(e)}/>
            </SmartInput> 

            <div className="cinema-detail-halls">
                <div className="cinema-detail-halls-header">
                    <h2>Sály kina</h2>
                    <p onClick={() => {
                        // pokud vytvářiš nový kino ulož ho 
                        if (tempData.id === null) {
                            storeAndRedirect()
                            // nebo přesměruj na stránku
                        } else {
                            navigate(`/management/halls/${tempData.id}/new`)
                        }
                
                    }}>Nový sál</p>
                </div>
                <div className="cinema-detail-halls-body">
                    {hallRecords}
                </div>
            </div>
        </>
    )
}

export default CinemaDetail