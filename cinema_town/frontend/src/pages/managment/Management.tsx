import ManagementReferation from '../../components/management/ManagementReference'
import verifyAccess from '../../global_functions/verifyAccess'
import './Management.css'

const Management = () => {

    const projections = verifyAccess('projection-create') ? <ManagementReferation imgName='projection-favikon.png' url='/management/projections' text='Naplánovaná promítání' /> : <></>
    const cinamas = verifyAccess('cinema-update') ? <ManagementReferation imgName='cinema-favicon-98.png' url='/management/cinemas' text='Naše multikina' /> : <></>
    const films = verifyAccess('film-create') ? <ManagementReferation imgName='film-favicon.png' url='/management/films' text='Správa filmů' /> : <></>
    const users = verifyAccess('user-update') ? <ManagementReferation imgName='user-favicon.png' url='/management/users' text='Správa uživatelů' /> : <></>
    const genres = verifyAccess('genre-update') ? <ManagementReferation imgName='genre-favicon.png' url='/management/genres' text='Správa žánrů' /> : <></>

    const roles = verifyAccess('role-update') ? <ManagementReferation imgName='role-favicon.png' url='/management/roles/' text='Správa rolí' /> : <></>
    
    // TODO přidat rezervace

    // TODO veměnit favikon
    const ageCategories = verifyAccess('ageCategory-update') ? <ManagementReferation imgName='user-favicon.png' url='/management/age_categories/' text='Správa věkových kategorií' /> : <></>


    return (
        <div className='management'>
            <div className="management-referations">
                {projections}
                {cinamas}
                {films}
                {genres}
                {users}
                {roles}
                {ageCategories}
            </div>
        </div>
    )
}

export default Management