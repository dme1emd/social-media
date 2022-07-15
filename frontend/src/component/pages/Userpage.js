import React, { useContext, useEffect, useState } from 'react'
import { createSearchParams, useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import '../../styles/userpage.css'
import jwt_decode from 'jwt-decode'
export const Userpage = () => {
    const {userId} = useParams()
    const {token}=useContext(AuthContext)
    const userid = jwt_decode(token.access).user_id
    const [profile,setProfile]=useState(null)
    const [followed,setFollowed]=useState(profile ? profile.follower.some(obj=>obj.follower.id === userid):false)
    const getProfile = async()=>{
        const response = await fetch(`http://127.0.0.1:8000/api/profiles/${userId}/`)
        const data = await response.json()
        setProfile(data)
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
    useEffect(()=>{getProfile()},[])
    useEffect(()=>{setFollowed(profile ? profile.follower.some(obj=>obj.follower.id === userid ): false)},[profile])
    if(profile){
            var jsx = userid === profile.id ? 
                <div className='modify'>
                    <button>modifier le profil</button>
                </div>
                :
                <div className='follow-container'>
                    {followed? <button onClick={handleUnFollow} className='followed'>followed</button> : <button onClick={handleFollow} className='follow'>follow</button>}
                </div>
    }

                
  return (
    profile?
    <div className='profile-container'>
        <div className='profile-header'>
            <div className='upper'>
                <img src={profile.profile_pic}/>
                <div className='publications-num'>{profile.publication_set.length} publications</div>
                <div className='follower-num'>{`${profile.follower.length} ${profile.follower.length>1 ? 'followers':'follower'}`}</div>
                <div className='following-num'>{`${profile.following.length} ${profile.following.length>1 ? 'followings':'following'}`}</div>
            </div>
            <div className='bio'>
                {profile.bio}
            </div>
            {jsx}
        </div>
        <div className='profile-publications'>
            {profile.publication_set.map((element)=>{return <img src={element.pic} className='publication'/>})}
        </div>
    </div> : <div></div>
  )
}
