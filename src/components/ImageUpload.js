import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { storage, db } from '../firebase'
import firebase from 'firebase'
const ImageUpload = ({username}) => {

    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            (err) =>{
                console.error(err);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageURL: url,
                            username: username
                        });
                        setCaption('');
                        setProgress(0);
                        setImage(null);
                    })
            }
        )
    }

    return (
        <div>
            <progress className="imageupload__progress" value={progress} max={100} />
            <input type='text' placeholder='Enter Caption' onChange={ e => setCaption(e.target.value)} value={caption} />
            <input type='file' onChange={handleChange} />
            <Button className="imageupload__button" onClick={handleUpload} variant="contained" color="primary" >Upload</Button>
        </div>
    )
}

export default ImageUpload
