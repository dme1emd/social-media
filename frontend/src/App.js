import './App.css';
import { Signup } from './component/pages/Signup';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { PrivateRoute } from './component/utils/PrivateRoute';
import { Nav } from './component/pages/Nav';
import { Login } from './component/pages/Login';
import AuthContext from './component/context/AuthContext';
import {useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { NonAuthRoutes } from './component/utils/NonAuthRoutes';
import { Logout } from './component/pages/Logout';
import { Home } from './component/pages/Home';
import { Userpage } from './component/pages/Userpage';
import {Redirect} from '../src/component/utils/Redirect'
import {Search} from './component/pages/Search'
import { Notifications } from './component/pages/Notifications';
function App() {
  const [notifications , setNotifications]=useState([])
  const [local , setLocal]=useState(localStorage.getItem('token'))
  const [token,setToken]= useState(localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')):null)
  const [user , setUser]=useState(token ? jwt_decode(token.access):null)
  const [notified , setNotified] = useState(false)
  const getNotifications= async ()=>{
    const response = await fetch(`http://127.0.0.1:8000/api/notifications/${jwt_decode(token.access).user_id}/`)
    const data = await response.json()
    setNotifications(data)
}
  const notif_socket_open= ()=>{
    const notif_socket =new WebSocket(`ws://127.0.0.1:8000/notification/${jwt_decode(token.access).user_id}/`)
    notif_socket.onopen=(e)=>{console.log(e)}
    notif_socket.onmessage= (e)=>{
      setNotified(true)
        if(JSON.parse(e.data).message.type=="acceptation"){
          const newNotification = JSON.parse(e.data).message
          setNotifications([...notifications, newNotification])
        }
        else{
          const newNotification = JSON.parse(e.data).message
          setNotifications([...notifications, newNotification])
        }

    }
    notif_socket.onerror= (e)=>{console.log(e)}
    notif_socket.onclose= (e)=>{console.log(e)}
}
  useEffect(token ? ()=>{getNotifications();notif_socket_open()} :()=>{console.log('not cn')},[])
  return (
    <div className="App">
      <BrowserRouter>
        <AuthContext.Provider value={{user , setUser,setToken,token,local,setLocal , notifications,getNotifications , notified , setNotified}}>
          <Nav className="navbar"/>
          <Routes>
            <Route element={<PrivateRoute/>}>
              <Route element={<Home/>} path="/"/>
              <Route element={<Logout/>} path='/logout/'/>
              <Route element={<Notifications/>} path='/notifications/'/>
              <Route Exact element={<Userpage/>} path='/user/:userId/'/>
              <Route Exact element={<Redirect/>} path='/redirect/:id'/>
              <Route Exact element={<Search/>} path='/search/'/>

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
