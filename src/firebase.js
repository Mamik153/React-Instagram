import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB0tZezKXr0fTjVrqiQiiFIAW2diCaAK88",
    authDomain: "react-instagram-clone-85e58.firebaseapp.com",
    databaseURL: "https://react-instagram-clone-85e58.firebaseio.com",
    projectId: "react-instagram-clone-85e58",
    storageBucket: "react-instagram-clone-85e58.appspot.com",
    messagingSenderId: "1092947835801",
    appId: "1:1092947835801:web:84366314de00c09f793108",
    measurementId: "G-D3C8SFCEQL"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };