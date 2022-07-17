import React, { useContext, useEffect, useState } from 'react'
import '../../styles/followerfollowing.css'
import AuthContext from '../context/AuthContext'
import jwt_decode from 'jwt-decode'
import {Link} from 'react-router-dom'
export const Follower = ({profile }) => {
  const [followed , setFollowed] = useState(false)
  const [followings , setFollowings]=useState(null)
  const {token} =useContext(AuthContext)
  const userid=jwt_decode(token.access).user_id
  const getFollowings =async()=>{
    const respose = await fetch(`http://127.0.0.1:8000/api/profiles/${userid}/`)
    const data =(await respose.json()).following
    setFollowings(data)
  }
  const handleFollow = async()=>{
    fetch(`http://127.0.0.1:8000/api/follows/`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body : JSON.stringify({'follower':userid,'following':profile.id})
    })
    setFollowed(true)
}
  const handleUnFollow = async()=>{
    fetch(`http://127.0.0.1:8000/api/follows/`,{
        method:'DELETE',
        headers:{'Content-Type':'application/json'},
        body : JSON.stringify({'follower':userid,'following':profile.id})
    })
    setFollowed(false)
}
  useEffect(()=>{getFollowings()},[])
  useEffect(()=>{setFollowed(followings ? followings.some((following)=>following.following.id ===profile.id):false)},[followings])
  return (
    <div className='follower-container'>
      <Link to={`/redirect/${profile.id}`} className='left'>
        <img src={profile.profile_pic}/>
        <div className='follower-username'>{profile.username}</div>
      </Link>
      {followed ? <button className='followed' onClick={handleUnFollow}>unfollow</button> :<button className='follow' onClick={handleFollow}>follow</button> }
    </div>
  )
}
