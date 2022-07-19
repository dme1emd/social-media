import React ,{useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import {GrHomeRounded} from 'react-icons/gr'
import { BiSearch } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import jwt_decode from 'jwt-decode'
import '../../styles/nav.css'
export const Nav = () => {
    const {token} = useContext(AuthContext)
    const connected_jsx = token?
    <ul>
            <li><Link to='/'><GrHomeRounded/></Link></li>
            <li><Link to='/search/'><BiSearch/></Link></li>
            <li><Link to={`user/${jwt_decode(token.access).user_id}`}><CgProfile/></Link></li>
            <li><Link to='/logout/'>logout</Link></li>
    </ul>:''
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
