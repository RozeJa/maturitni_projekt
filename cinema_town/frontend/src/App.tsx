import './App.css';
import { BrowserRouter, Routes, Route, RouterProvider} from 'react-router-dom';
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
import UserDetail from './pages/managment/UserDetail';
import ProjectionDetail from './pages/managment/ProjectionDetail';
import CinemaDetail from './pages/managment/CinemaDetail';
import HallDetail from './pages/managment/HallDetail';

function App() {

  const loginErr = <Err err='400' message='Někdo už je přihlášený' />
  const pwChangeErr = <Err err='400' message='Pro změnu hesla musí být uživatel přihlášený' />
  const accessDenite = <Err err='403' message='Přístup odepřen' />

  return (
    <BrowserRouter>
      <Routes>  
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Home />} />
          {/*<Route path='/group-dashboard/:groupId' Component={() => isAuthenticated() ? <GroupDashboard /> : <Navigate to="/" />}/>*/}
          <Route path='/register' element={ (verifyAccess() ? loginErr : <Register />) }/> 
          <Route path='/login' element={ (verifyAccess() ? loginErr : <Login />) }/>
          <Route path='/pw-reset' element={ (verifyAccess() ? loginErr : <PwReset />) }/>
          <Route path='/pw-change' element={ (verifyAccess() ? <PwChange /> : pwChangeErr) } />

          <Route path='/film/:fimlId' element={ <FilmDetail /> }/>
          <Route path='/my-reservation/:userId' element={ (verifyAccess() ? <MyReservations /> : loginErr) } />
          <Route path='/my-reservation/:userId/:reservationId' element={ (verifyAccess() ? <MyReservation /> : loginErr) } />
          
          <Route path='/management' element={ (verifyAccess("film-update") ? <Management /> : accessDenite) } />
          <Route path='/management/cinemas'/>
          <Route path='/management/projections'/>
          <Route path='/management/users'/>
          <Route path='/management/films'/>

          <Route path='/management/users/new' element={ (verifyAccess("user-add") ? <UserDetail /> : accessDenite) } />
          <Route path='/management/projections/new' element={ (verifyAccess("projection-add") ? <ProjectionDetail /> : accessDenite ) }/>
          <Route path='/management/cinemas/new' element={ (verifyAccess("cinema-add") ? <CinemaDetail /> : accessDenite) }/>
          <Route path='/management/halls/:new' element={ (verifyAccess("hall-add") ? <HallDetail /> : accessDenite) } />

          <Route path='/management/users/:userId' element={ (verifyAccess("user-edit") ? <UserDetail /> : accessDenite) } />
          <Route path='/management/projections/:projectionId' element={ (verifyAccess("projection-edit") ? <ProjectionDetail /> : accessDenite) }/>
          <Route path='/management/cinemas/:cinemaId' element={ (verifyAccess("cinema-edit") ? <CinemaDetail /> : accessDenite) }/>
          <Route path='/management/halls/:hallId' element={ (verifyAccess("hall-edit") ? <HallDetail /> : accessDenite) } />
          
          <Route path='*' element={ <Err />}/>
        </Route>
      </Routes> 
    </BrowserRouter>
  )
}

export default App
