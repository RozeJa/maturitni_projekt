import { useEffect, useState } from 'react'
import './UsersSpreadsheet.css'
import './Spreadsheet.css'
import User from '../../../models/User'
import { ModesEndpoints, deleteData, loadData } from '../../../global_functions/ServerAPI'
import { useNavigate } from 'react-router-dom'
import Filter from '../../../components/management/Filter'
import Tile from '../../../components/management/Tile'
import { handleErr } from '../../../global_functions/constantsAndFunction'
import RemoveConfirm from '../../../components/management/RemoveConfirm'

const defUsers: User[] = []
const UsersSpreadsheet = () => {

    const navigate = useNavigate()    
    const [users, setUsers] = useState([...defUsers])
    const [filtredUsers, setFitredUsers] = useState([...defUsers])
    
    const [removeConfirm, setRemoveConfirm] = useState(<></>)
    const [err, setErr] = useState(<></>)

    useEffect(() => {
        loadData<User>(ModesEndpoints.User)
            .then(data =>  setUsers(data))
            .catch(err => handleErr(setErr, err))
    }, [])
    
    useEffect(() => {
        setFitredUsers(users)
    }, [users])

    const remove = (user: User) => {
        deleteData<User>(ModesEndpoints.User, [user])
            .then(res => setUsers([...users.filter(d => d.id !== user.id)]))
            .catch(err => handleErr(setErr, err))
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
            {err}
            {removeConfirm}
            <div className="sp-header">
                <Filter filter={filter} />
                <p className='sp-header-title'>Správa uživatelů</p>
                <a href="/management/users/new"><b>Nový</b></a>
            </div>
            <div className="sp-body">
                { filtredUsers.map((d,index) => {      
                    return <Tile key={index.toString()}
                            header={d.email} 
                            onClick={()=>navigate(`/management/users/${d.id}`)}
                            actions={
                                <input type='button' value='Odebrat' onClick={() => setRemoveConfirm(<RemoveConfirm close={() => setRemoveConfirm(<></>)} callBack={() => remove(d)} />)} />
                            }
                            >
                            <>
                              <p><b>Role</b> {d.role.name}</p> 
                              <p><b>{d.active ? "Aktivován" : "Neaktivován" }</b></p>  
                              <p><b>{d.subscriber ? "Odběratel" : "Není odběratel" }</b></p> 
                            </>
                        </Tile>
                    }) }
            </div>
        </div>
    )
}

export default UsersSpreadsheet