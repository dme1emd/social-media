import React, { useState , useContext, useEffect} from 'react'
import '../../styles/publication.css'
import {FaHeart ,FaRegHeart, FaRegComment} from 'react-icons/fa'
import {FiSend} from 'react-icons/fi'
import AuthContext from '../context/AuthContext'
import jwt_decode from 'jwt-decode'
import { Link } from 'react-router-dom'
export const Publication = ({Publication}) => {
    const {token} = useContext(AuthContext)
    const [showDescription, setShowDescription] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [liked,setLiked]=useState(Publication.like_set.some(obj=>obj.sender.id===jwt_decode(token.access).user_id))
    const [commentAdd,SetCommentAdd]=useState('')
    const [publication, setPublication] = useState(Publication)
    console.log(liked)
    const handleComment=async (e)=>{
        e.preventDefault()
        await fetch('http://127.0.0.1:8000/api/comments/',{
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({'content':commentAdd,'sender':jwt_decode(token.access).user_id,'publication':publication.id})
        })
        SetCommentAdd('')
        const response = await fetch(`http://127.0.0.1:8000/api/publications/${publication.id}/`)
        const pub= await response.json()
        setPublication(pub)
    }
    const likeHandle = async()=>{
        await fetch('http://127.0.0.1:8000/api/likes/',{
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({'sender':jwt_decode(token.access).user_id,'publication':publication.id})
        }) 
                const response = await fetch(`http://127.0.0.1:8000/api/publications/${publication.id}/`)
        const pub= await response.json()
        setPublication(pub)
        setLiked(true)
    }
    const dislikeHandle = async()=>{
        await fetch('http://127.0.0.1:8000/api/likes/',{
            method:'DELETE',
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({'sender':jwt_decode(token.access).user_id,'publication':publication.id})
        }) 
        console.log('dislike')
        const response = await fetch(`http://127.0.0.1:8000/api/publications/${publication.id}/`)
        const pub= await response.json()
        setPublication(pub)
        setLiked(false)
    }
    if(publication.description){
        if(publication.description.length>=40){
            var jsx_des=<div className='description-container'>
                                <div className='description'>
                                    {showDescription?publication.description : publication.description.slice(0,39)+ '...'}
                                </div>
                                <button onClick={()=>{setShowDescription(!showDescription)}}>show {!showDescription?'all description':'less'}</button>
                        </div>
        }
        else{
            var jsx_des =<div className='description-container'>
                                <div className='description'>
                                   {publication.description}
                                </div>
                            </div>
        }
    }
    else{
        var jsx_des = ''
    }
    const link = `user/${publication.sender.id}`
  return (
    <div className='publication-container' key={publication.id}>

                        <Link to={link} className='publication-header'>
                            <img src={publication.sender.profile_pic ? publication.sender.profile_pic : '../../../../images/profile_pic/e-pic.jpeg'} className='profile-pic'/>
                            <div>{publication.sender.username}</div>
                        </Link>
                        <div className='publication-body'>
                            <img src={publication.pic} className='publication-pic'/>
                            {jsx_des}
                        </div>
                        <div className='publication-footer'>
                            <div className='interract-container'>
                                {liked? <FaHeart style={{color:'red'}} onClick={dislikeHandle}></FaHeart>:<FaRegHeart style={{size:"2em"}} onClick={likeHandle}></FaRegHeart>}
                                <FaRegComment onClick={()=>{setShowComments(!showComments)}}></FaRegComment>
                            </div>
                            <div className='likes-number'>
                                {`${publication.like_set.length} ${publication.like_set.length > 1 ?'likes':'like'} `}
                            </div>
                            <div className={ showComments?'comments-container':"none"}>
                                <form onSubmit={commentAdd ?  handleComment : (e)=>{e.preventDefault()}}>
                                    <input type='text' name='comment' value={commentAdd} onChange={(e)=>{SetCommentAdd(e.target.value)}} className='add-comment'/>
                                    <button><FiSend></FiSend></button>
                                </form>
                                {publication.comment_set.reverse().map((comment)=>{return(
                                    <div className='comment-container'>
                                        <div className='comment-header'>
                                            <img src={comment.sender.profile_pic}/>
                                            <div>{comment.sender.username}</div>
                                        </div>
                                        <div className='comment-body'>
                                            {comment.content}
                                        </div>
                                    </div>
                                )})}
                            </div>

                        </div>
    </div>
  )
}
