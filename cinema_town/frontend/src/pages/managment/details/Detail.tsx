    import React, { useEffect, useState } from 'react';
import './Detail.css'
import { ModesEndpoints, loadData, storeData } from '../../../global_functions/ServerAPI';
import { useNavigate, useParams } from 'react-router-dom';
import DialogErr from '../../../components/DialogErr';
import { handleErr, handleErrRedirect } from '../../../global_functions/constantsAndFunction';
import Entity from '../../../models/Entity';
import { getSessionStorageItem } from '../../../global_functions/storagesActions';

const tempData = "tempData"

export const storeDetailData = (data: Entity) => {
    sessionStorage.setItem(tempData, JSON.stringify(data))
}

const Detail = <T extends Entity> ({
        defaultData,
        modesEndpoint,
        spreadsheetURL,
        titleNew,
        titleEdit,
        validateData,
        readRepresentData,
        InnerForm
    }: {
        defaultData: T,
        modesEndpoint: ModesEndpoints,
        spreadsheetURL: string,
        titleNew: string,
        titleEdit: string,
        validateData: Function,
        readRepresentData: Function,
        InnerForm: any
    }) => {    
       
    const { id } = useParams<string>()
    
    const [data, setData] = useState<T>(defaultData);
    const [err, setErr] = useState(<></>)
    
    const [title, setTitle] = useState('')
    const [form, setForm] = useState(<></>)
    
    const navigate = useNavigate()

    useEffect(() => {
        if (typeof id === 'string') {
            load(id)
        }
    }, [])

    
    useEffect(() => {
        if (title === '' || title === `${titleEdit}: ` || title == `${titleEdit}: null`) {
            setTitle(id === undefined ? `${titleNew}` : `${titleEdit}: ${readRepresentData(data)}`)            
        } 
    }, [data])

    useEffect(() => {
        setForm(<InnerForm data={data} setErr={(err: JSX.Element) => setErr(err)}></InnerForm>)
    }, [data])

    const load = (id: string) => {
        loadData<T>(modesEndpoint, [id])
            .then(data => {
                const d = data.pop()
                if (d !== undefined) {                
                    setData(d)
                }          
            })
            .catch(err => handleErrRedirect(setErr, err))
    }

    const store = () => {
        const data = JSON.parse(getSessionStorageItem(tempData))

        let errs: Array<string> = validateData(data)
        if (errs.length > 0) {
            let errLog: string = ''

            errs.forEach((err) => errLog += ` ${err}`);

            setErr(<DialogErr err='Chybně vyplněný formulář' description={errLog} dialogSetter={setErr} okText={'Ok'} />)
            return
        }
    
        storeData<T>(modesEndpoint, [data])
            .then(data => {
                sessionStorage.removeItem(tempData)
                navigate(spreadsheetURL)
            })
            .catch(err => handleErr(setErr, err))
    }

    return (
        <div className='detail'>
            {err}
            <h1>{title}</h1>
            <div className='detail-body'>
                {form}
            </div>
            <div className='detail-submit'>
                <a href={spreadsheetURL}>Zahodit změny</a>
                <button onClick={()=>store()}>
                    {id === undefined ? 'Vytvořit' : 'Potvrdit změny'}
                </button>
            </div>
        </div>
    )
}

export default Detail