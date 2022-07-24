import React, { useContext, useState } from 'react'
import '../../styles/notification.css'
import NotificationContext from '../context/NotificationContext'
export const Notification = ({Notification}) => {
  const [done,setDone] = useState(false)
  const handleAccept = async()=>{
    setDone(true)
    const acceptSocket = new WebSocket(`ws:127.0.0.1:8000/notification/${Notification.doer.id}/`)
    acceptSocket.onopen = ()=>{
      acceptSocket.send(JSON.stringify({type:'acceptation',id:Notification.id,invitor:Notification.doer.id,invited:Notification.to}))
      console.log('open')
    }
    acceptSocket.onmessage = (e)=>{console.log(e)}
    acceptSocket.onerror = ()=>{}
    acceptSocket.onclose = (e)=>{console.log(e)}
  }
  const handleDismiss =()=>{

  }
  if(Notification.type==='invitation'){
    return (!done?
    <div className='invitation'>
      <div className='notification-content'>
              {Notification.doer.username} has invited you
      </div>
      <div>
        <button className='accept-invitation' onClick={handleAccept}>
          accept
        </button>
        <button className='dismiss-invitation' onClick={handleDismiss}>
          dismiss
        </button>
      </div>

    </div>:''
    )
  }
  return Notification.type=="acceptation"?<div>you are now following {Notification.doer.username}</div> : 'mazal'
}
