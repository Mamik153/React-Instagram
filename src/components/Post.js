import React, {useState, useEffect} from 'react'
import './post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from '../firebase'
import firebase from 'firebase'

const Post = ({ username, caption, imageURL, postId, user }) => {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState([]);
    
    useEffect(() => {
       let unsubscribe;
        if(postId) {
            unsubscribe = db
                            .collection("posts")
                            .doc(postId)
                            .collection("comments")
                            .orderBy('timestamp', 'asc')
                            .onSnapshot((snapshot) => {
                                setComments(snapshot.docs.map((doc) => doc.data()))
                            })
        }

        return () => {
            unsubscribe();
        }
    }, [postId])

    const postComment = (e) => {
        e.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className='post'>
            <div className='post__header'>
                <Avatar 
                    className='post__avatar'
                    alt={username} 
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

            <div className='post__comments'>
                {comments.map((comment, index) => {
                    return (
                        <p key={index}>
                            <strong>{comment.username}</strong>&nbsp;{comment.text}
                        </p>
                    )
                })}
            </div>

            {user && (
                <form className='post__commentBox'>
                    <input 
                        type='text' 
                        placeholder='Add a comment...' 
                        className='post__input'
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                    <button
                        disabled={!comment}
                        className='post__button'
                        type='submit'
                        onClick={postComment}
                    >
                        Post
                    </button>
                
                </form>
            )}
            
        </div>
    )
}

export default Post
