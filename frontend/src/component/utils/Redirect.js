import React from 'react'
import {Navigate, useParams} from 'react-router-dom'
export const Redirect = () => {
  const {id} = useParams()
  return (
    <Navigate to={`/user/${id}`} replace/>
  )
}
