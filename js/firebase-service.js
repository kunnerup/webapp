const firebaseConfig = {
  apiKey: "AIzaSyCvyPcQHvikqeM0rl188nz0FZfC5qTaf3k",
  authDomain: "anders-web-app.firebaseapp.com",
  databaseURL: "https://anders-web-app.firebaseio.com",
  projectId: "anders-web-app",
  storageBucket: "anders-web-app.appspot.com",
  messagingSenderId: "997223589905",
  appId: "1:997223589905:web:0b501a72f99b1a66e569b0",
  measurementId: "G-4FG2ENTLQZ"
};

// INITIALIZE FIREBASE
firebase.initializeApp(firebaseConfig);
const firebaseDB = firebase.firestore();
