import * as firebase from "firebase/app";
import "firebase/storage";
import Firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyBhMdZ2kQMkXkrjPVs7bp1wC3_tFxxU5Z0",
  authDomain: "appointment-register.firebaseapp.com",
  databaseURL: "https://appointment-register.firebaseio.com",
  projectId: "appointment-register",
  storageBucket: "appointment-register.appspot.com",
  messagingSenderId: "212497568539",
  appId: "1:212497568539:web:6f888df99500f6328a79be",
  measurementId: "G-VXRL35TKZ8"
};
 const app = firebase.initializeApp(firebaseConfig);
 const database = Firebase.database();
 const storage=Firebase.storage();
 export {app,database,storage};
