//LOGIN
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

   // SER OM BRUGERNE LOGGES RIGTIGT IND
   firebase.auth().onAuthStateChanged(function(user) {
  if (user) { // Hvis brugeren er logget rigtigt ind, så:
    userAuthenticated(user);
  } else { // hvis brugeren ikke er logget korrekt ind, så:
    userNotAuthenticated();
  }
});


//FUNKTIONEN HVIS BRUGEREN FINDES
function userAuthenticated(user) {
  appendUserData(user);
  hideMenu(false);
  showLoader(false);
}
 //HVIS BRUGEREN IKKE FINDES
function userNotAuthenticated() {
  hideMenu(true);
  showPage("login");


  // Firebase UI indstillinger - her tilføjes mail, google og telefonløsningen
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
   firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    signInSuccessUrl: '#buy'
  };

  // Firebase UI
const ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);
showLoader(false);
}

function checkLoginState() {
FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
});
}

//VIS/SKJUL MENUEN
function hideMenu(hide) {
  let menu = document.querySelector('#menu');
  if (hide) {
    menu.classList.add("hide");
  } else {
    menu.classList.remove("hide");
  }
}

//LOG UD
function logout() {
  firebase.auth().signOut();
document.navigateTo('#login');
}

function appendUserData(user) {
  document.querySelector('#profil').innerHTML += `
    <h3>${user.displayName}</h3>
    <p>${user.email}</p>
    <p>${user.img}</p>
  `;
}
