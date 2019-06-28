import * as firebase from 'firebase';
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBh7_lGs5SdwnDr5wY5N1N3cDMAX-yLtNE",
    authDomain: "fifty50x.firebaseapp.com",
    databaseURL: "https://fifty50x.firebaseio.com",
    projectId: "fifty50x",
    storageBucket: "fifty50x.appspot.com",
    messagingSenderId: "959337859375",
    appId: "1:959337859375:web:a8f2ffa3d109f97f"
  };

export const firebaseApp = firebase.initializeApp(firebaseConfig);