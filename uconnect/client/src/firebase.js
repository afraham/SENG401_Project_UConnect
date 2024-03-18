// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyA9b03adj_Mf_-8WHFT9YJe3buRS-Ymdxs",
	authDomain: "projectauth-ae262.firebaseapp.com",
	projectId: "projectauth-ae262",
	storageBucket: "projectauth-ae262.appspot.com",
	messagingSenderId: "766724046278",
	appId: "1:766724046278:web:4dd1695005c240ac54c6c7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export { auth };
