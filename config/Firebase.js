import * as firebase from 'firebase';
import 'firebase/firestore';

var config = {
  apiKey: "AIzaSyBcN4NF05AAMnglydPzgMTXSo2PMfx2HUI",
  authDomain: "societee-app.firebaseapp.com",
  databaseURL: "https://societee-app.firebaseio.com",
  projectId: "societee-app",
  storageBucket: "",
  messagingSenderId: "617818294734"
};

firebase.initializeApp(config);

export default firebase;