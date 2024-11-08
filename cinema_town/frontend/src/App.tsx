import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/usersPages/Home';
import Err from './pages/Err';
import verifyAccess from './global_functions/verifyAccess';
import Login from './pages/login/Login';
import Register from './pages/login/Register';
import PwReset from './pages/login/PwReset';
import PwChange from './pages/login/PwChange';
import FilmDetail from './pages/usersPages/FilmDetail';
import MyReservations from './pages/usersPages/MyReservations';
import Management from './pages/managment/Management';
import UserDetail, { validateUser } from './pages/managment/details/UserDetail';
import ProjectionDetail, { validateProjection } from './pages/managment/details/ProjectionDetail';
import CinemaDetail, { validateCinema } from './pages/managment/details/CinemaDetail';
import HallDetail from './pages/managment/details/HallDetail';
import GenreDetail, { validateGenre } from './pages/managment/details/GenreDetail';
import ProjectionsSpreadsheet from './pages/managment/spreadsheets/ProjectionsSpreadSheet';
import CinemasSpreadsheet from './pages/managment/spreadsheets/CinemasSpreadsheet';
import UsersSpreadsheet from './pages/managment/spreadsheets/UsersSpreadsheet';
import FilmsSpreadsheet from './pages/managment/spreadsheets/FilmsSpreadsheet';
import GenresSpreadsheet from './pages/managment/spreadsheets/GenresSpreadsheet';
import RolesSpreadsheet from './pages/managment/spreadsheets/RolesSpreadsheet';
import RoleDetail, { validateRole } from './pages/managment/details/RoleDetail';
import Detail from './pages/managment/details/Detail';
import User, { defaultUser } from './models/User';
import { ModesEndpoints } from './global_functions/ServerAPI';
import Projection, { defaultProjection } from './models/Projection';
import Cinema, { defaultCinema } from './models/Cinema';
import Genre, { defaultGerne } from './models/Genre';
import Role, { defaultRole } from './models/Role';
import Film, { defaultFilm } from './models/Film';
import FilmDetailEdit, { validateFilm } from './pages/managment/details/FilmDetail';
import AgeCategory, { defaultAgeCategory } from './models/AgeCategory';
import AgeCategoryDetail, { validateAgeCategory } from './pages/managment/details/AgeCategoryDetail';
import AgeCategoriSpreadsheet from './pages/managment/spreadsheets/AgeCategoriSpreadsheet';
import PwResetRequest from './pages/login/PwResetRequest';

function App() {

  const loginErr = <Err err='400' message='Někdo už je přihlášený' />
  const pwChangeErr = <Err err='400' message='Pro změnu hesla musí být uživatel přihlášený' />
  const accessDenite = <Err err='403' message='Přístup odepřen' />

  const userDetail = <Detail  
                        defaultData={defaultUser}
                        modesEndpoint={ModesEndpoints.User}
                        spreadsheetURL='/management/users/'
                        titleNew='Nový uživatel'
                        titleEdit='Uživatel'
                        validateData={validateUser}
                        readRepresentData={(data: User) => data.email}
                        InnerForm={UserDetail} />

  const projectionDetail = <Detail  
                        defaultData={defaultProjection}
                        modesEndpoint={ModesEndpoints.Projection}
                        spreadsheetURL='/management/projections/'
                        titleNew='Nové promítání'
                        titleEdit='Promítání'
                        validateData={validateProjection}
                        readRepresentData={(data: Projection) => data.id}
                        InnerForm={ProjectionDetail} />

  const cinemaDetail = <Detail  
                        defaultData={defaultCinema}
                        modesEndpoint={ModesEndpoints.Cinama}
                        spreadsheetURL='/management/cinemas/'
                        titleNew='Nové multikino'
                        titleEdit='Multikino'
                        validateData={validateCinema}
                        readRepresentData={(data: Cinema) => data.id}
                        InnerForm={CinemaDetail} />
  const hallDetail = <HallDetail />
  const genreDetail = <Detail  
                        defaultData={defaultGerne}
                        modesEndpoint={ModesEndpoints.Genre}
                        spreadsheetURL='/management/genres/'
                        titleNew='Nový žánr'
                        titleEdit='Žánr'
                        validateData={validateGenre}
                        readRepresentData={(data: Genre) => data.name}
                        InnerForm={GenreDetail} />
  const roleDetail = <Detail  
                        defaultData={defaultRole}
                        modesEndpoint={ModesEndpoints.Role}
                        spreadsheetURL='/management/roles/'
                        titleNew='Nová role'
                        titleEdit='Role'
                        validateData={validateRole}
                        readRepresentData={(data: Role) => data.name}
                        InnerForm={RoleDetail} />

  const filmDetail = <Detail
                        defaultData={defaultFilm}
                        modesEndpoint={ModesEndpoints.Film}
                        spreadsheetURL='/management/films/'
                        titleNew='Nový film'
                        titleEdit='Film'
                        validateData={validateFilm}
                        readRepresentData={(data: Film) => data.name}
                        InnerForm={FilmDetailEdit} />
  const ageCategoryDetail = <Detail 
                        defaultData={defaultAgeCategory}
                        modesEndpoint={ModesEndpoints.AgeCategory}
                        spreadsheetURL='/management/age_categories'
                        titleNew='Nová kategorie'
                        titleEdit='Kategorie'
                        validateData={validateAgeCategory}
                        readRepresentData={(data:AgeCategory) => data.name}
                        InnerForm={AgeCategoryDetail}/>

  return (
    <BrowserRouter>
      <Routes>  
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Home />} />
          
          {/** Stránky pro přihlašování */}
          <Route path='/register' element={ (verifyAccess() ? loginErr : <Register />) }/> 
          <Route path='/login' element={ (verifyAccess() ? loginErr : <Login />) }/>
          <Route path='/pw-reset/' element={ (verifyAccess() ? loginErr : <PwResetRequest />) }/>
          <Route path='/pw-reset/:email' element={ (verifyAccess() ? loginErr : <PwReset />) }/>
          <Route path='/pw-change' element={ (verifyAccess() ? <PwChange /> : pwChangeErr) } />

          {/** Stránky pro rezervování */}
          <Route path='/film/:fimlId' element={ <FilmDetail /> }/>
          <Route path='/my-reservation/:userId' element={ (verifyAccess() ? <MyReservations /> : accessDenite) } />
          
          <Route path='/management'>
            <Route path='' element={ (verifyAccess("projection-create") ? <Management /> : accessDenite) } />

            {/** Stránky pro výpis dat */}
            <Route path='projections' element={ (verifyAccess("projection-update") ? <ProjectionsSpreadsheet /> : accessDenite) }/>
            <Route path='cinemas' element={ (verifyAccess("cinema-update") ? <CinemasSpreadsheet /> : accessDenite) }/>
            <Route path='users' element={ (verifyAccess("user-update") ? <UsersSpreadsheet /> : accessDenite) }/>
            <Route path='films' element={ (verifyAccess("film-update") ? <FilmsSpreadsheet /> : accessDenite) }/>
            <Route path='genres' element={ (verifyAccess("genre-update") ? <GenresSpreadsheet /> : accessDenite) }/>
            <Route path='roles' element={ (verifyAccess("role-update") ? <RolesSpreadsheet /> : accessDenite) }/>
            <Route path='age_categories' element={ (verifyAccess("role-update") ? <AgeCategoriSpreadsheet /> : accessDenite) }/>

            {/** Stránky pro přidávání dat */}
            <Route path='users/new' element={ (verifyAccess("user-create") ? userDetail : accessDenite) } />
            <Route path='projections/new' element={ (verifyAccess("projection-create") ? projectionDetail : accessDenite ) }/>
            <Route path='cinemas/new' element={ (verifyAccess("cinema-create") ? cinemaDetail : accessDenite) }/>
            <Route path='halls/:cinemaId/new' element={ (verifyAccess("hall-create") ? hallDetail : accessDenite) } />
            <Route path='genres/new' element={ (verifyAccess("genre-create") ? genreDetail : accessDenite) } />
            <Route path='films/new' element={ (verifyAccess("film-create") ? filmDetail : accessDenite) } />
            <Route path='age_categories/new' element={ (verifyAccess("ageCategory-create") ? ageCategoryDetail : accessDenite) } />

            {/** Stránky pro editaci dat */}
            <Route path='users/:id' element={ (verifyAccess("user-update") ? userDetail : accessDenite) } />
            <Route path='projections/:id' element={ (verifyAccess("projection-update") ? projectionDetail : accessDenite) }/>
            <Route path='cinemas/:id' element={ (verifyAccess("cinema-update") ? cinemaDetail : accessDenite) }/>
            <Route path='halls/:cinemaId/:id' element={ (verifyAccess("hall-update") ? hallDetail : accessDenite) } />
            <Route path='genres/:id' element={ (verifyAccess("genre-update") ? genreDetail : accessDenite) } />
            <Route path='roles/:id' element={ (verifyAccess("role-update") ? roleDetail : accessDenite) } />
            <Route path='films/:id' element={ (verifyAccess("film-update") ? filmDetail : accessDenite) } />
            <Route path='age_categories/:id' element={ (verifyAccess("ageCategory-update") ? ageCategoryDetail : accessDenite) } />
          </Route>


          
          <Route path='*' element={ <Err />}/>
        </Route>
      </Routes> 
    </BrowserRouter>
  )
}

export default App
