import { useEffect, useState } from 'react'
import Role from '../../../models/Role'
import './RolesSpreadsheet.css'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI'
import { useNavigate } from 'react-router-dom'

const defData: Role[] = []
const RolesSpreadsheet = () => {

    const navigate = useNavigate()    
    const [data, setData] = useState(defData)

    useEffect(() => {
        load();
    }, [])

    const load = async () => {
        setData(await loadData<Role>(ModesEndpoints.Role))
    }

    return (
        <div className='sp'>
            <div className="sp-header">
                <div className="filter">
                </div>
                <a href="/management/roles/new">new</a>
            </div>
            <div className="sp-body">
                <table>
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        { data.map((d) => {      
                        return <tr key={d.id} onClick={()=>navigate(`/management/roles/${d.id}`)}>
                                <td>{d.name}</td>
                                <td>Odebrat</td>
                            </tr>
                        }) }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RolesSpreadsheet