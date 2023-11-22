import React, { useEffect, useState } from 'react';
import './Detail.css'
import { ApiData, ModesEndpoints, loadData, storeData } from '../../../global_functions/ServerAPI';
import { useNavigate, useParams } from 'react-router-dom';
import DialogErr from '../../../components/DialogErr';



const Detail = <T extends ApiData> ({
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

    const [form, setForm] = useState(<></>)

    const navigate = useNavigate()    

    useEffect(() => {
        if (typeof id === 'string') {
            load(id)
        }
        
    }, [])

    useEffect(() => {
        setForm(<InnerForm data={data} handleInputText={handleInputText} handleInputCheckbox={handleInputCheckbox} setData={(newData: T) => (setData(newData))} setErr={(err: JSX.Element) => setErr(err)}></InnerForm>)
    }, [data])

    const load = async (id: string) => {
        try {
            let data = (await loadData<T>(modesEndpoint, [id])).pop()
            if (data !== undefined) {
                console.log(data);
                
                setData(data)
            }            
        } catch (error) {
            // TODO rozpracovat errory
            setErr(<DialogErr err='Přístup odepřen' description={"Nemáte dostatečné oprávnění pro načtení dat"} dialogSetter={setErr} okText={<a href='/management/'>Ok</a>} />)

            console.log(error);
            
        }

    }

    const store = async () => {
        
        let errs: Array<string> = validateData(data)
        if (errs.length > 0) {
            let errLog: string = ''

            errs.forEach((err) => errLog += ` ${err}`);

            setErr(<DialogErr err='Chybně vyplněný formulář' description={errLog} dialogSetter={setErr} okText={'Ok'} />)
            return
        }

        try {
            const resp = await storeData<T>(modesEndpoint, [data]);

            navigate(spreadsheetURL)
        } catch (error) {
            // TODO dořešit přesnou chybu pro uživatele 
            console.log(data);
            
            setErr(<DialogErr err='Nastala chyba při vkládání do db' description='Přesné změní chyby nebylo dosud implementováno' dialogSetter={setErr} okText={'ok'} />)
        }
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
            <h1>{id === undefined ? `${titleNew}` : `${titleEdit}: ${readRepresentData(data)}`}</h1>
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