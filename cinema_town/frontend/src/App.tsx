import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, RouterProvider} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>  
        <Route path='/'>
          <Route index />
            {/*<Route path='/group-dashboard/:groupId' Component={() => isAuthenticated() ? <GroupDashboard /> : <Navigate to="/" />}/>*/}
          <Route path='/register'/> 
          <Route path='/login'/>
          <Route path='/pw-reset'/>
          <Route path='/pw-change'/>

          <Route path='/film/:{id}'/>
          <Route path='/my-reservation'/>
          <Route path='/my-reservation/:reservationId'/>
          
          <Route path='/management'/>
          <Route path='/management/cinemas'/>
          <Route path='/management/projections'/>
          <Route path='/management/users'/>
          <Route path='/management/films'/>

          <Route path='/management/users/:userId'/>
          <Route path='/management/projections/:projectionId'/>
          <Route path='/management/cinemas/:cinemaId'/>
          <Route path='/management/halls/:hallId'/>
          
          <Route path='*'/>{/*<Route path='*' element={<Error code='404' call={"Not Found"} />} />*/}
        </Route>
      </Routes> 
    </BrowserRouter>
  )
}

export default App
