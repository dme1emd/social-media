import React from 'react'
import { useContext } from 'react' 
import { Notification } from '../ elements/Notification'
import AuthContext from '../context/AuthContext'
export const Notifications = () => {
    const {setNotified , notifications} = useContext(AuthContext)
    setNotified(false)
  return (
    notifications ? notifications.map((e)=><Notification Notification={e}/>) : 'no notification for now'
  )
}
