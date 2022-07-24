import React, { useLayoutEffect, useMemo, useState } from 'react'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import jwt_decode from 'jwt-decode'
import '../../styles/home.css'
import { Publication } from '../ elements/Publication'
import { Notification } from '../ elements/Notification'
import NotificationContext from '../context/NotificationContext'
export const Home = () => {
    const [publications , setPublications]=useState([])
    const {token , notifications , getNotifications} = useContext(AuthContext)
    const getPublications= async ()=>{
        const response = await fetch(`http://127.0.0.1:8000/api/home/${jwt_decode(token.access).user_id}`)
        const data = await response.json()
        setPublications([])
        setPublications(data)
    }

    useLayoutEffect(()=>{getPublications();},[])
  return (
    <div className='home'>
        {   publications.map((publication)=>
            {
                return(<Publication Publication={publication}/>)
            })
        }
    </div>
  )
}