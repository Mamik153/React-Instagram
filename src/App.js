import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post';
import { db, auth } from './firebase'
import { makeStyles } from '@material-ui/core/styles';
//import Modal from '@material-ui/core/Modal';
import { Modal, Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';



function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    fontFamily: 'Roboto',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null)

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  
  useEffect(() => {
    const unsubscribe =  auth.onAuthStateChanged((authUser) => {
      if(authUser){
        console.log(authUser);
        setUser(authUser);

      }else{
        setUser(null)
      }
    })

    return () => {
      //Perform some cleanup
      unsubscribe();
    }

  }, [user, username])

  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post :doc.data()
      })))
    })
  }, [])

  const signIn = e => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch(err => alert(err.message))

    setOpenSignIn(false)
  }

  const signUp = (e) => {
    e.preventDefault();
    
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch(err => alert(err.message))
      setOpen(false)
  }

  return (
    <div className="App">
      <Modal 
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img 
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt=''
              />
            </center>
            
            <Input
              placeholder='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br/>
            <Button variant="contained" color="primary" onClick={signUp}>SIGN UP</Button>
          </form>
        </div>
      </Modal>


      <Modal 
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img 
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt=''
              />
            </center>
            
            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br/>
            <Button variant="contained" color="primary" onClick={signIn}>LOG IN</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img 
        className='app__headerImage'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt=''
        />
      </div>

      {
       user ?  (
          <Button onClick={() => auth.signOut()}>Logout</Button> 
        ):( 
          <div className='app__loginContainer'>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
          
        )
      }
      {user?.displayName ? <ImageUpload username={user.displayName} /> : <h3>Login to upload</h3>}
      
      

      {
        posts.map(({post, id}) => {
          return <Post key={id} {...post} />
        })
      }
      
    </div>
  );
}

export default App;
