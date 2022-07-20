import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/search.css'
export const Search = () => {
    const [profiles, setProfiles] = useState(null)
    const [search , setSearch] = useState('')
    const handleSearch=(e)=>{
        setSearch(e.target.value)
    }
    const getProfiles=async()=>{
        const response = await fetch(`http://127.0.0.1:8000/api/profiles/?search=${search}`)
        const data = await response.json()
        setProfiles(data)
    }
    const handleUnFollow = async()=>{
        fetch(`http://127.0.0.1:8000/api/notifications/1/`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body : JSON.stringify({'follower':1,'following':2})
        })
    }
    useEffect(()=>{getProfiles() ; handleUnFollow()},[search])
  return (
      <div>
        <form>
            <input type='search' onChange={handleSearch} value={search}/>
        </form>
        <div className='results'>
            {search && profiles ? profiles.results.map((e)=>{return (
                <Link to={`/user/${e.id}`} className='result' key={e.id}>
                    <img src={e.profile_pic}/>
                   <div className='username'>
                       {e.username}
                   </div>
                </Link>
                )
            }):''}
        </div>
      </div> 
  )
}
