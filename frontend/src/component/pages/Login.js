import React , {useContext}from 'react'
import AuthContext from '../context/AuthContext'
import jwt_decode from 'jwt-decode'
import { useEffect,useState } from 'react'
import { Navigate } from 'react-router-dom'
export const Login = () => {
    const [local , setLocal]=useState(localStorage.getItem('token'))
    const {token , setToken , user , setUser}= useContext(AuthContext)
    const login =async (e)=>{
        e.preventDefault()
        const response = await fetch('http://127.0.0.1:8000/api/token/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                'username': e.target.username.value,
                'password':e.target.password.value
            })
                 
        })
        const tok = await response.json()
        console.log(response.status)
        if(response.status ===200){
            localStorage.setItem('token',JSON.stringify(tok))
            setLocal(localStorage.getItem('token'))
        }
    }
    useEffect(() => {
        setToken(JSON.parse(local))
   
    }, [local])
    useEffect(()=>{
        setUser(token ? jwt_decode(token.access).user_id : null)
    },[token])
  return (
    <form onSubmit={login}>
        <input name="username" type="text" placeholder='enter your username'/>
        <input name="password" type="password" placeholder='enter password'/>
        <button>login</button>
    </form>
  )
}
