import React, { useEffect, useState } from 'react';
import './Detail.css'
import { ModesEndpoints, loadData, storeData } from '../../../global_functions/ServerAPI';
import { useNavigate, useParams } from 'react-router-dom';
import DialogErr from '../../../components/DialogErr';
import { handleErr, handleErrRedirect } from '../../../global_functions/constantsAndFunction';
import Entity from '../../../models/Entity';


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
        setForm(<InnerForm data={data} handleInputText={handleInputText} handleInputCheckbox={handleInputCheckbox} setData={(newData: T) => (setData(newData))} setErr={(err: JSX.Element) => setErr(err)}></InnerForm>)
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
        
        let errs: Array<string> = validateData(data)
        if (errs.length > 0) {
            let errLog: string = ''

            errs.forEach((err) => errLog += ` ${err}`);

            setErr(<DialogErr err='Chybně vyplněný formulář' description={errLog} dialogSetter={setErr} okText={'Ok'} />)
            return
        }
    
        storeData<T>(modesEndpoint, [data])
            .then(data => navigate(spreadsheetURL))
            .catch(err => handleErr(setErr, err))
    }

    const handleInputText = (event: any) => {
        const { name, value } = event.target

        setData({ ...data, [name]: value })
    }

    const handleInputCheckbox = (event: any) => {
        const { name, checked } = event.target
        
        setData({ ...data, [name]: checked })
    }

    return (
        <div className='detail'>
            {err}
            <h1>{title}</h1>
            <div className='detail-body'>
                {form}
            </div>
            <div className='detail-submit'>
                <button onClick={()=>store()}>
                    {id === undefined ? 'Vytvořit' : 'Potvrdit změny'}
                </button>
                <a href={spreadsheetURL}>Zahodit změny</a>
            </div>
        </div>
    )
}

export default Detail