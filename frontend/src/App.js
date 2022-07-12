import './App.css';
import { Signup } from './component/pages/Signup';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { PrivateRoute } from './component/utils/PrivateRoute';
import { Nav } from './component/pages/Nav';
import { Login } from './component/pages/Login';
import AuthContext from './component/context/AuthContext';
import {useState } from 'react';
import jwt_decode from 'jwt-decode';
import { NonAuthRoutes } from './component/utils/NonAuthRoutes';
import { Logout } from './component/pages/Logout';
import { Home } from './component/pages/Home';
function App() {
  const [local , setLocal]=useState(localStorage.getItem('token'))
  const [token,setToken]= useState(localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')):null)
  const [user , setUser]=useState(token ? jwt_decode(token.access):null)
  return (
    <div className="App">
      <BrowserRouter>
        <AuthContext.Provider value={{user , setUser,setToken,token,local,setLocal}}>
          <Nav/>
          <Routes>
            <Route element={<PrivateRoute/>}>
              <Route element={<Home/>} path="/"/>
              <Route element={<Logout/>} path='/logout/'/>
            </Route>
            <Route element={<NonAuthRoutes/>}>
              <Route element={<Signup/>} path="signup/"/>
              <Route element={<Login/>} path="login/"/>
            </Route>

          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
