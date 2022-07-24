import React, { useContext, useEffect, useState } from 'react'
import { createSearchParams, useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import '../../styles/userpage.css'
import jwt_decode from 'jwt-decode'
import { Follower } from '../ elements/Follower'
import {BsArrowLeft} from 'react-icons/bs'
export const Userpage = () => {
    const {userId} = useParams()
    const [Userid , setUserId]=useState(userId)
    const {token}=useContext(AuthContext)
    const userid = jwt_decode(token.access).user_id
    const [profile,setProfile]=useState(null)
    const [followed,setFollowed]=useState(profile ? profile.follower.some(obj=>obj.follower.id === userid):false)
    const [followerSection , setFollowerSection] = useState(false)
    const [followingSection , setFollowingSection] = useState(false)
    const [invited , setInvited]=useState(profile ? profile.invitation_from.some((e)=>e.invitor.id===userid) : false)
    const getProfile = async()=>{
        const response = await fetch(`http://127.0.0.1:8000/api/profiles/${Userid}/`)
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
    const handleInvite =()=>{
        setInvited(true)
        const notif_socket = new WebSocket(`ws://127.0.0.1:8000/notification/${profile.id}/`)
        notif_socket.onopen=(e)=>{
            notif_socket.send(JSON.stringify({type:'invitation',invitor:userid,invited:profile.id}))
            console.log(e)
        }
        notif_socket.onmessage=()=>{}
        notif_socket.onerror=()=>{}
        notif_socket.onclose=()=>{}
    }
    useEffect(()=>{getProfile()},[])
    useEffect(()=>{
        setFollowed(profile ? profile.follower.some(obj=>obj.follower.id === userid ): false)
        setInvited(profile ?profile.invitation_from.some((e)=>e.invitor.id===userid):false)
    },[profile])
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
    if(profile)
    if(profile.is_private && !followed && userid != profile.id){
            return(
                profile?
                <div className='profile-container'>
                    <div className='profile-header'>
                        <div className='upper'>
                            <img src={profile.profile_pic}/>
                            <div className='publications-num'>{profile.publication_set.length} publications</div>
                            <div className='follower-num'>{`${profile.follower.length} ${profile.follower.length>1 ? 'followers':'follower'}`}</div>
                            <div className='following-num'>{`${profile.following.length} ${profile.following.length>1 ? 'followings':'following'}`}</div>
                        </div>
                        <div className='username'>{profile.username}</div>
                        {invited ? <button>invited</button>:<button onClick={handleInvite}>send ivitation</button>}
                    </div>
                </div> : ''
            )
    }
                
  return (
      
    profile?
    <div className='profile-container'>
        <div className='profile-header'>
            <div className='upper'>
                <img src={profile.profile_pic}/>
                <div className='publications-num'>{profile.publication_set.length} publications</div>
                <button className='follower-num' onClick={()=>{setFollowerSection(true)}}>{`${profile.follower.length} ${profile.follower.length>1 ? 'followers':'follower'}`}</button>
                <button className='following-num' onClick={()=>{setFollowingSection(true)}}>{`${profile.following.length} ${profile.following.length>1 ? 'followings':'following'}`}</button>
            </div>
            <div className='username'>{profile.username}</div>
            <div className='bio'>
                {profile.bio}
            </div>
            {jsx}
        </div>
        <div className='profile-publications'>
            {profile.publication_set.map((element)=>{return <img src={element.pic} className='publication'/>})}
        </div>
        {   
            followerSection ?
            <div className='followers'>
                followers
                {profile.follower.map((element)=>{return <Follower profile={element.follower} key={element.follower.id}></Follower>})}
            </div>
            :
            ''
        }
                {   
            followingSection ?
            <div className='followings'>
                followings
                {profile.following.map((element)=>{return <Follower profile={element.following} key={element.following.id}></Follower>})}
            </div>
            :
            <div></div>
        }
        {followerSection || followingSection ? <button className='sections-false' onClick={()=>{setFollowingSection(false) ; setFollowerSection(false)}}> <BsArrowLeft/> </button> : <div></div>}
    </div> : <div></div>
  )
}
