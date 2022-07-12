import React , {useContext , useEffect} from 'react'
import AuthContext from '../context/AuthContext'
export const Logout = () => {
    const {setLocal , setToken , setUser} = useContext(AuthContext)
    localStorage.removeItem('token')
    setLocal(null)
    setToken(null)
    setUser(null)
  return (
    <div>
    </div>
  )
}
