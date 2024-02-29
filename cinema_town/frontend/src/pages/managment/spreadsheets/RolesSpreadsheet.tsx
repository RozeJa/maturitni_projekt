import { useEffect, useState } from 'react'
import Role from '../../../models/Role'
import './RolesSpreadsheet.css'
import './Spreadsheet.css'
import { ModesEndpoints, deleteData, loadData } from '../../../global_functions/ServerAPI'
import { useNavigate } from 'react-router-dom'
import Tile from '../../../components/management/Tile'
import Filter from '../../../components/management/Filter'
import { handleErr } from '../../../global_functions/constantsAndFunction'
import RemoveConfirm from '../../../components/management/RemoveConfirm'

const defData: Role[] = []
const RolesSpreadsheet = () => {

    const navigate = useNavigate()    
    const [data, setData] = useState([...defData])
    const [filtredData, setFiltredData] = useState([...defData])

    const [removeConfirm, setRemoveConfirm] = useState(<></>)
    const [err, setErr] = useState(<></>)

    useEffect(() => {
        loadData<Role>(ModesEndpoints.Role)
            .then(data => setData(data))
            .catch(err => handleErr(setErr, err))
    }, [])

    useEffect(() => {
        setFiltredData(data)
    }, [data])

    const remove = (role: Role) => {
        deleteData<Role>(ModesEndpoints.Role, [role])
            .then(res => setData([...data.filter(d => d.id !== role.id)]))
            .catch(err => handleErr(setErr, err))
    }

    const filter = (e:any) => {
        const { value } = e.target 

        const newData = data.filter(r => (
            r.name.toLowerCase().split(value.toLowerCase()).length > 1 ||
            r.name.toLowerCase() === value.toLowerCase()
        ))
        
        setFiltredData([...newData])    
    }

    return (
        <div className='sp'>
            {err}
            {removeConfirm}
            <div className="sp-header">
                <Filter filter={filter} />
                <p className='sp-header-title'>Správa rolí</p>
                <a href="/management/roles/new"><b>Nový</b></a>
            </div>
            <div className="sp-body">
                { filtredData.map((d,index) => {      
                    return <Tile key={index.toString()}
                            header={d.name} 
                            onClick={()=>navigate(`/management/roles/${d.id}`)}
                            actions={
                                <input type='button' value='Odebrat' onClick={() => setRemoveConfirm(<RemoveConfirm close={() => setRemoveConfirm(<></>)} callBack={() => remove(d)} />)} />
                            }
                            >
                            <p><b>Přidělených oprávnění </b>{Object.values(d.permissions !== null ? d.permissions : {}).length}
                            </p>
                        </Tile>
                    }) }
            </div>
        </div>
    )
}

export default RolesSpreadsheet