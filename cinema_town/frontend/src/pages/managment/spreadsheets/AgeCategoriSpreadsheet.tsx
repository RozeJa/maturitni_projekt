import { useNavigate } from 'react-router-dom'
import AgeCategory from '../../../models/AgeCategory'
import './AgeCategoriSpreadsheet.css'
import { useEffect, useState } from 'react'
import { ModesEndpoints, deleteData, loadData } from '../../../global_functions/ServerAPI'
import { handleErr } from '../../../global_functions/constantsAndFunction'
import Filter from '../../../components/management/Filter'
import Tile from '../../../components/management/Tile'
import RemoveConfirm from '../../../components/management/RemoveConfirm'

const defData: AgeCategory[] = []
const AgeCategoriSpreadsheet = () => {

    const navigate = useNavigate()    
    const [data, setData] = useState([...defData])
    const [filtredData, setFiltredData] = useState([...defData])
    
    const [removeConfirm, setRemoveConfirm] = useState(<></>)
    const [err, setErr] = useState(<></>)

    useEffect(() => {
        loadData<AgeCategory>(ModesEndpoints.AgeCategory)
            .then(data => {
                setData(
                    data.sort((a,b) => a.name.localeCompare(b.name))
                )
            })
            .catch(err => handleErr(setErr, err))
    }, [])
    
    useEffect(() => {
        setFiltredData(data)
    }, [data])

    const remove = (ac: AgeCategory) => {
        deleteData<AgeCategory>(ModesEndpoints.AgeCategory, [ac])
            .then(res => setData([...data.filter(d => d.id !== ac.id)]))
            .catch(err => handleErr(setErr, err))
    }

    const filter = (e:any) => {
        const { value } = e.target 

        const lowValue = value.toLowerCase()

        const newData = data.filter(d => d.name.toLowerCase() === lowValue || d.name.toLowerCase().split(lowValue).length > 1)
        
        setFiltredData([...newData])    
    }

    return (
        <div className='sp'>
            {err}
            {removeConfirm}
            <div className="sp-header">
                <Filter filter={filter} />
                <p className='sp-header-title'>Správa cenových/věkových kategoriích</p>
                <a href="/management/age_categories/new"><b>Nový</b></a>
            </div>
            <div className="sp-body age_categories-sp-body">
                { filtredData.map((d,index) => {      
                    return <Tile key={index.toString()}
                            header={d.name} 
                            onClick={()=>navigate(`/management/age_categories/${d.id}`)}
                            actions={
                                <input type='button' value='Odebrat' onClick={() => setRemoveConfirm(<RemoveConfirm close={() => setRemoveConfirm(<></>)} callBack={() => remove(d)} />)} />
                            }
                            >
                            <p><b/>Cenový koeficient:<b/> {d.priceModificator}</p>
                        </Tile>
                    }) }
            </div>
        </div>
    )
}

export default AgeCategoriSpreadsheet