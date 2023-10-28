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
import MyReservation from './pages/usersPages/MyReservation';
import Management from './pages/managment/Management';
import UserDetail, { validateUser } from './pages/managment/details/UserDetail';
import ProjectionDetail, { validateProjection } from './pages/managment/details/ProjectionDetail';
import CinemaDetail, { validateCinema } from './pages/managment/details/CinemaDetail';
import HallDetail, { validateHall } from './pages/managment/details/HallDetail';
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
import Hall, { defaultHall } from './models/Hall';
import Genre, { defaultGerne } from './models/Genre';
import Role, { defaultRole } from './models/Role';
import Film, { defaultFilm } from './models/Film';
import FilmDetailEdit, { validateFilm } from './pages/managment/details/FilmDetail';

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

  return (
    <BrowserRouter>
      <Routes>  
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Home />} />
          
          <Route path='/register' element={ (verifyAccess() ? loginErr : <Register />) }/> 
          <Route path='/login' element={ (verifyAccess() ? loginErr : <Login />) }/>
          <Route path='/pw-reset' element={ (verifyAccess() ? loginErr : <PwReset />) }/>
          <Route path='/pw-change' element={ (verifyAccess() ? <PwChange /> : pwChangeErr) } />

          <Route path='/film/:fimlId' element={ <FilmDetail /> }/>
          <Route path='/my-reservation/:userId' element={ (verifyAccess() ? <MyReservations /> : accessDenite) } />
          <Route path='/my-reservation/:userId/:reservationId' element={ (verifyAccess() ? <MyReservation /> : accessDenite) } />
          
          <Route path='/management' element={ (verifyAccess("projection-create") ? <Management /> : accessDenite) } />
          <Route path='/management/projections' element={ (verifyAccess("projection-update") ? <ProjectionsSpreadsheet /> : accessDenite) }/>
          <Route path='/management/cinemas' element={ (verifyAccess("cinema-update") ? <CinemasSpreadsheet /> : accessDenite) }/>
          <Route path='/management/users' element={ (verifyAccess("user-update") ? <UsersSpreadsheet /> : accessDenite) }/>
          <Route path='/management/films' element={ (verifyAccess("film-update") ? <FilmsSpreadsheet /> : accessDenite) }/>
          <Route path='/management/genres' element={ (verifyAccess("genre-update") ? <GenresSpreadsheet /> : accessDenite) }/>
          <Route path='/management/roles' element={ (verifyAccess("role-update") ? <RolesSpreadsheet /> : accessDenite) }/>

          <Route path='/management/users/new' element={ (verifyAccess("user-create") ? userDetail : accessDenite) } />
          <Route path='/management/projections/new' element={ (verifyAccess("projection-create") ? projectionDetail : accessDenite ) }/>
          <Route path='/management/cinemas/new' element={ (verifyAccess("cinema-create") ? cinemaDetail : accessDenite) }/>
          <Route path='/management/halls/:cinemaId/new' element={ (verifyAccess("hall-create") ? hallDetail : accessDenite) } />
          <Route path='/management/genres/new' element={ (verifyAccess("genre-create") ? genreDetail : accessDenite) } />
          <Route path='/management/films/new' element={ (verifyAccess("film-create") ? filmDetail : accessDenite) } />

          <Route path='/management/users/:id' element={ (verifyAccess("user-update") ? userDetail : accessDenite) } />
          <Route path='/management/projections/:id' element={ (verifyAccess("projection-update") ? projectionDetail : accessDenite) }/>
          <Route path='/management/cinemas/:id' element={ (verifyAccess("cinema-update") ? cinemaDetail : accessDenite) }/>
          <Route path='/management/halls/:cinemaId/:id' element={ (verifyAccess("hall-update") ? hallDetail : accessDenite) } />
          <Route path='/management/genres/:id' element={ (verifyAccess("genre-update") ? genreDetail : accessDenite) } />
          <Route path='/management/roles/:id' element={ (verifyAccess("role-update") ? roleDetail : accessDenite) } />
          <Route path='/management/films/:id' element={ (verifyAccess("film-update") ? filmDetail : accessDenite) } />
          
          <Route path='*' element={ <Err />}/>
        </Route>
      </Routes> 
    </BrowserRouter>
  )
}

export default App
