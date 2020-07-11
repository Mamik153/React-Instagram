import React from 'react'
import './post.css'
import Avatar from '@material-ui/core/Avatar'
const Post = ({ username, caption, imageURL }) => {
    return (
        <div className='post'>
            <div className='post__header'>
                <Avatar 
                    className='post__avatar'
                    alt="Travis Howard" 
                    src="/static/images/avatar/2.jpg" 
                />
                <h3>{username}</h3>
            </div>

            <img 
            className='post__image'
                src={imageURL} 
                alt='' 
            />
        
            <h4 className='post__text'>
                <strong>{username}</strong> 
                &nbsp; {caption}
            </h4>
        </div>
    )
}

export default Post
