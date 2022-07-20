import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import jwt_decode from 'jwt-decode'
import '../../styles/home.css'
import { Publication } from '../ elements/Publication'
import { Notification } from '../ elements/Notification'
export const Home = () => {
    const [publications , setPublications]=useState([])
    const [notifications , setNotifications]=useState([])
    const [tet , setTet] = useState('')
    const {token} = useContext(AuthContext)
    const getPublications= async ()=>{
        const response = await fetch(`http://127.0.0.1:8000/api/home/${jwt_decode(token.access).user_id}`)
        const data = await response.json()
        setPublications(data)
    }
    const getNotifications= async ()=>{
        const response = await fetch(`http://127.0.0.1:8000/api/notifications/${jwt_decode(token.access).user_id}/`)
        const data = await response.json()
        setNotifications(data)
    }
    useEffect(()=>{getPublications();getNotifications();},[])
    const notif_socket =new WebSocket(`ws://127.0.0.1:8000/notification/${jwt_decode(token.access).user_id}/`)
    notif_socket.onopen= (e)=>{console.log(e)}
    notif_socket.onmessage=(e)=>{
        getNotifications()
        console.log(e)
        }
    notif_socket.onerror= (e)=>{console.log('error',e)}
    notif_socket.onclose= (e)=>{console.log('closed',e)}
  return (
    <div className='home'>
        {   publications.map((publication)=>
            {
                return(<Publication Publication={publication}/>)
            })
        }
        {notifications ? notifications.map((not)=>{
            return <Notification Notification={not}/>
        }) : ''}
    </div>
  )
}