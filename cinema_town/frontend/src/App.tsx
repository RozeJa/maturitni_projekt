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
import Management from './pages/managment/details/Management';
import UserDetail from './pages/managment/details/UserDetail';
import ProjectionDetail from './pages/managment/details/ProjectionDetail';
import CinemaDetail from './pages/managment/details/CinemaDetail';
import HallDetail from './pages/managment/details/HallDetail';
import GenreDetail from './pages/managment/details/GenreDetail';
import ProjectionsSpreadsheet from './pages/managment/spreadsheets/ProjectionsSpreadSheet';
import CinemasSpreadsheet from './pages/managment/spreadsheets/CinemasSpreadsheet';
import UsersSpreadsheet from './pages/managment/spreadsheets/UsersSpreadsheet';
import FilmsSpreadsheet from './pages/managment/spreadsheets/FilmsSpreadsheet';
import GenresSpreadsheet from './pages/managment/spreadsheets/GenresSpreadsheet';
import RolesSpreadsheet from './pages/managment/spreadsheets/RolesSpreadsheet';

function App() {

  const loginErr = <Err err='400' message='Někdo už je přihlášený' />
  const pwChangeErr = <Err err='400' message='Pro změnu hesla musí být uživatel přihlášený' />
  const accessDenite = <Err err='403' message='Přístup odepřen' />

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

          <Route path='/management/users/new' element={ (verifyAccess("user-create") ? <UserDetail /> : accessDenite) } />
          <Route path='/management/projections/new' element={ (verifyAccess("projection-create") ? <ProjectionDetail /> : accessDenite ) }/>
          <Route path='/management/cinemas/new' element={ (verifyAccess("cinema-create") ? <CinemaDetail /> : accessDenite) }/>
          <Route path='/management/halls/new' element={ (verifyAccess("hall-create") ? <HallDetail /> : accessDenite) } />
          <Route path='/management/genres/new' element={ (verifyAccess("genre-create") ? <GenreDetail /> : accessDenite) } />

          <Route path='/management/users/:userId' element={ (verifyAccess("user-update") ? <UserDetail /> : accessDenite) } />
          <Route path='/management/projections/:projectionId' element={ (verifyAccess("projection-update") ? <ProjectionDetail /> : accessDenite) }/>
          <Route path='/management/cinemas/:cinemaId' element={ (verifyAccess("cinema-update") ? <CinemaDetail /> : accessDenite) }/>
          <Route path='/management/halls/:hallId' element={ (verifyAccess("hall-update") ? <HallDetail /> : accessDenite) } />
          <Route path='/management/genres/:genreId' element={ (verifyAccess("genre-update") ? <GenreDetail /> : accessDenite) } />
          <Route path='/management/roles/:roleId' element={ (verifyAccess("genre-update") ? <GenreDetail /> : accessDenite) } />
          
          <Route path='*' element={ <Err />}/>
        </Route>
      </Routes> 
    </BrowserRouter>
  )
}

export default App
