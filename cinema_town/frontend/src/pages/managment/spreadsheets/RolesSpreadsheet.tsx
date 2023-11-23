import { useEffect, useState } from 'react'
import Role from '../../../models/Role'
import './RolesSpreadsheet.css'
import './Spreadsheet.css'
import { ModesEndpoints, deleteData, loadData } from '../../../global_functions/ServerAPI'
import { useNavigate } from 'react-router-dom'
import Tile from '../../../components/management/Tile'
import Filter from '../../../components/management/Filter'

const defData: Role[] = []
const RolesSpreadsheet = () => {

    const navigate = useNavigate()    
    const [data, setData] = useState([...defData])
    const [filtredData, setFiltredData] = useState([...defData])

    useEffect(() => {
        load();
    }, [])

    useEffect(() => {
        setFiltredData(data)
    }, [data])

    const load = async () => {
        try {
            const roles = (await loadData<Role>(ModesEndpoints.Role))

            setData(roles)
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const remove = async (role: Role) => {
        try {
            deleteData<Role>(ModesEndpoints.Role, [role])

            load()
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const filter = (e:any) => {
        const { value } = e.target 

        const newData = data.filter(r => r.name.toLowerCase().split(value.toLowerCase()).length > 1 || r.name.toLowerCase() === value.toLowerCase())
        
        setFiltredData([...newData])    
    }

    return (
        <div className='sp'>
            <div className="sp-header">
                <Filter filter={filter} />
                <a href="/management/roles/new"><b>Nový</b></a>
            </div>
            <div className="sp-body">
                { filtredData.map((d,index) => {      
                    return <Tile key={index.toString()  }
                            header={d.name} 
                            onClick={()=>navigate(`/management/roles/${d.id}`)}
                            actions={
                                <input type='button' value='Odebrat' onClick={() => remove(d)} />
                            }
                            >
                            <p>
                                Počet přidělených oprávnění {Object.values(d.permissions !== null ? d.permissions : {}).length}
                            </p>
                        </Tile>
                    }) }
            </div>
        </div>
    )
}

export default RolesSpreadsheet