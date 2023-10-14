import ManagementReferation from '../../../components/management/ManagementReference'
import verifyAccess from '../../../global_functions/verifyAccess'
import './Management.css'

const Management = () => {

    const projections = verifyAccess('projection-create') ? <ManagementReferation imgName='projection-favikon.png' url='/management/projections' text='Naplánovaná promítání' /> : <></>
    const cinamas = verifyAccess('cinema-update') ? <ManagementReferation imgName='cinema-favikon-98.png' url='/management/cinemas' text='Naše multikina' /> : <></>
    const films = verifyAccess('film-create') ? <ManagementReferation imgName='film-favikon.png' url='/management/films' text='Správa filmů' /> : <></>
    const users = verifyAccess('user-update') ? <ManagementReferation imgName='user-favikon.png' url='/management/users' text='Správa uživatelů' /> : <></>
    const genres = verifyAccess('genre-update') ? <ManagementReferation imgName='genre-favicon.png' url='/management/genres' text='Správa žánrů' /> : <></>
    
    return (
        <div className='management'>
            <div className="management-referations">
                {projections}
                {cinamas}
                {films}
                {users}
                {genres}
            </div>
        </div>
    )
}

export default Management