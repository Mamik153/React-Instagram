import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post';
import { db, auth } from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed'


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
    width: '70%',
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [upload, setUpload] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null)

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  
  useEffect(() => {
    const unsubscribe =  auth.onAuthStateChanged((authUser) => {
      if(authUser){
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
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
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


      <Modal 
        open={upload}
        onClose={() => setUpload(false)}
      >
        <div>
          {user?.displayName ? <ImageUpload setUpload={setUpload} username={user.displayName} /> : '' }
        </div>
      </Modal>



      <div className="app__header">
        <img 
        className='app__headerImage'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt=''
        />
        {
          user ?  (
            <div className='app__loginContainer'>
              <Button onClick={() => setUpload(true)}><ion-icon size="large" name="add-circle-outline"></ion-icon></Button>
              <Button onClick={() => auth.signOut()}>Logout</Button> 
            </div>
          ):( 
            <div className='app__loginContainer'>
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
              
          )
        }
      </div>


      <div className='app__posts'>
        <div className='app__postsLeft'>
          {
          posts.map(({post, id}) => {
            return <Post key={id} postId={id} user={user} {...post} />
          })
        }
        </div>
        
        <div className='app__postsRight'>
          <InstagramEmbed
            url='https://www.instagram.com/p/CChEoSFJFnm/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div> 
      </div>
      
      

      {/*user?.displayName ? <ImageUpload username={user.displayName} /> : <h3>Login to upload</h3>*/}
      
    </div>
  );
}

export default App;
