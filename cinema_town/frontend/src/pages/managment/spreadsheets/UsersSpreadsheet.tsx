import { useEffect, useState } from 'react'
import './UsersSpreadsheet.css'
import './Spreadsheet.css'
import User from '../../../models/User'
import { ModesEndpoints, deleteData, loadData } from '../../../global_functions/ServerAPI'
import { useNavigate } from 'react-router-dom'
import Filter from '../../../components/management/Filter'
import Tile from '../../../components/management/Tile'

const defUsers: User[] = []
const UsersSpreadsheet = () => {

    const navigate = useNavigate()    
    const [users, setUsers] = useState([...defUsers])
    const [filtredUsers, setFitredUsers] = useState([...defUsers])

    useEffect(() => {
        loadUsers();
    }, [])
    
    useEffect(() => {
        setFitredUsers(users)
    }, [users])

    const loadUsers = async () => {
        try {
            const users = (await loadData<User>(ModesEndpoints.User))
            
            setUsers(users)
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const remove = async (user: User) => {
        try {
            deleteData<User>(ModesEndpoints.User, [user])

            loadUsers()
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const filter = (e: any) => {
        const { value } = e.target

        const newUsers = users.filter(u => {
            return (
                u.email.toLowerCase().split(value.toLowerCase()).length > 1 || 
                u.email.toLowerCase() === value.toLowerCase() ||
                u.role.name.toLowerCase() === value.toLowerCase() ||
                u.role.name.toLowerCase().split(value.toLowerCase()).length > 1
            )
        })

        setFitredUsers([...newUsers])
    }

    return (
        <div className='sp'>
            <div className="sp-header">
                <Filter filter={filter} />
                <a href="/management/users/new"><b>Nový</b></a>
            </div>
            <div className="sp-body">
                { filtredUsers.map((d,index) => {      
                    return <Tile key={index.toString()}
                            header={d.email} 
                            onClick={()=>navigate(`/management/users/${d.id}`)}
                            actions={
                                <input type='button' value='Odebrat' onClick={() => remove(d)} />
                            }
                            >
                            <>
                              <p><b>Role:</b> {d.role.name}</p> 
                              <p>{d.active ? "Aktivován" : "Neaktivován" }</p>  
                              <p>{d.active ? "Odběratel" : "Není odběratel" }</p> 
                            </>
                        </Tile>
                    }) }
            </div>
        </div>
    )
}

export default UsersSpreadsheet