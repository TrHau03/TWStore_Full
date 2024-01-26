
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyAcP-f3nqlV5im7DZcTheVvoNj4t3SNKC8",
    authDomain: "twstore-f4ae5.firebaseapp.com",
    projectId: "twstore-f4ae5",
    storageBucket: "twstore-f4ae5.appspot.com",
    messagingSenderId: "329976951900",
    appId: "1:329976951900:web:d68ae90d239fe24ca66299"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);



const uploadImage = async (files: any, cate: any) => {
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, `${cate}/` + files.originalname);
    const uploadTask = await uploadBytesResumable(storageRef, files.buffer);
    let url = getDownloadURL(uploadTask.ref).then((downloadURL) => {
        return downloadURL;
    });
    return url;
    // Listen for state changes, errors, and completion of the upload.
};
export default uploadImage;