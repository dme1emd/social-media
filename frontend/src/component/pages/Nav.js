import React from 'react'
import { Link } from 'react-router-dom'
export const Nav = () => {
  return (
    <div>
        <ul>
            <li><Link to='/signup/'>signup</Link></li>
            <li><Link to='/'>home</Link></li>
            <li><Link to='/login/'>login</Link></li>
        </ul>
    </div>
  )
}
