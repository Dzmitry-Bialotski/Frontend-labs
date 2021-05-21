var firebaseConfig = {
    apiKey: "AIzaSyDIb-TT523bUuKfruoKsO8MvA4yyzSZL9Q",
    authDomain: "browser-chess.firebaseapp.com",
    projectId: "browser-chess",
    storageBucket: "browser-chess.appspot.com",
    messagingSenderId: "1093086314170",
    appId: "1:1093086314170:web:25a61c1c037aebe3bb0c83"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const firestore = firebase.firestore();
const db = firebase.database();
const storage = firebase.storage();
const storageRef = storage.ref();
//firebase.auth();
//firebase.firestore();
//firebase.database();
//firebase.storage().ref();