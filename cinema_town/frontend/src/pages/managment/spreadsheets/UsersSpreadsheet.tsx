import { useEffect, useState } from 'react'
import './UsersSpreadsheet.css'
import User from '../../../models/User'
import { ModesEndpoints, loadData } from '../../../global_functions/ServerAPI'
import { useNavigate } from 'react-router-dom'

const defUsers: User[] = []
const UsersSpreadsheet = () => {

    const navigate = useNavigate()    
    const [users, setUsers] = useState(defUsers)

    useEffect(() => {
        loadUsers();
    }, [])

    const loadUsers = async () => {
        setUsers(await loadData<User>(ModesEndpoints.User))
    }

    return (
        <div className='sp'>
            <div className="sp-header">
                <div className="filter">
                </div>
                <a href="/management/users/new">new</a>
            </div>
            <div className="sp-body">
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Aktivovaný</th>
                            <th>Odběratel</th>
                            <th>Role</th>
                            <th>Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        { users.map((u) => {
                            return <tr key={u.id} onClick={()=>navigate(`/management/users/${u.id}`)}>
                                <td>{u.email}</td>
                                <td>{u.active ? "Aktivován" : "Neaktivován" }</td>
                                <td>{u.subscriber ? "Odebírá" : "Neodebírá" }</td>
                                <td>{u.role.name}</td>
                                <td>Odebrat</td>
                            </tr>
                        }) }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UsersSpreadsheet