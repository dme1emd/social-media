import React from 'react'

export const Notification = ({Notification}) => {
  if(Notification.type==='invitation'){
    return (
    <div>
      {Notification.doer} has invited you
    </div>
    )
  }
  return <div>mazal </div>
}
