import React ,{useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import {GrHomeRounded} from 'react-icons/gr'
export const Nav = () => {
    const {token , user , local} = useContext(AuthContext)
    const connected_jsx = 
    <ul>
            <li><Link to='/'><GrHomeRounded/></Link></li>
            <li><Link to='/logout/'>logout</Link></li>
    </ul>
    const not_connected_jsx = 
    <ul>     
        <li><Link to='/signup/'>signup</Link></li>
        <li><Link to='/login/'>login</Link></li>
    </ul>
  return (
    <div className='navbar'>
        <ul>
            {token ? connected_jsx : not_connected_jsx}

        </ul>
    </div>
  )
}
