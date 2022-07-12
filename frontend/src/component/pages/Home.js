import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import jwt_decode from 'jwt-decode'
import '../../styles/home.css'
export const Home = () => {
    const [publications , setPublications]=useState([])
    const {token} = useContext(AuthContext)
    const getPublications= async ()=>{
        const response = await fetch(`http://127.0.0.1:8000/api/home/${jwt_decode(token.access).user_id}`)
        const data = await response.json()
        setPublications(data)
        console.log(data)
    }
    useEffect(()=>{getPublications()},[])
  return (
    <div className='home'>
        {   publications.map((publication)=>
            {
                return(
                <div className='publication-container' key={publication.id}>
                        <div className='publication-header'>
                            <img src={publication.sender.profile_pic ? publication.sender.profile_pic : '../../../../images/profile_pic/e-pic.jpeg'} className='profile-pic'/>
                            <h2>{publication.sender.username}</h2>
                        </div>
                        <div className='publication-body'>
                            <img src={publication.pic} className='publication-pic'/>
                            <div className='publication-description'>
                                {publication.description}
                            </div>
                        </div>
                        <div className='publication-footer'>
                            {publication.comment_set.map((comment)=>{<h6>comment</h6>})}
                        </div>
                    </div>)
            })
      }

    </div>
  )
}
