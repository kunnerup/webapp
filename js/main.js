"use strict";
import SpaService from "./spa.js";
import MadService from "./mad-service.js";

let _spaService = new SpaService("login");
let _madService = new MadService();
let _selectedUserId = "";
let _selectedImgFile ="";

window.pageChange = function() {
  _spaService.pageChange();
}

//CREATE MAD
window.createFood = () => {
  // references to the input fields
  let imageInput = document.querySelector('#imagePreview');
  let nameInput = document.querySelector('#madoverskrift');
  let beskrivelseInput = document.querySelector('#madbeskrivelse');
  let gramInput = document.querySelector('#gram');
  let prisInput = document.querySelector('#pris');

  _madService.create(imageInput.src, nameInput.value, beskrivelseInput.value, gramInput.value, prisInput.value);
  _spaService.navigateTo("buy");
  imageInput = "";
}

//BILLEDET AF RETTEN
window.previewImage = (file, previewId) => {
  if (file) {
    _selectedImgFile = file;
    let reader = new FileReader();
    reader.onload = event => {
      document.querySelector('#' + previewId).setAttribute('src', event.target.result);
    };
    reader.readAsDataURL(file);
  }}

//DELETE MAD
  window.delete = (id) => {
    console.log(ret.id);
    _madService.delete(ret.id);
  }

//SØGEFUNKTION
  window.search = function(searchValue) {
  _madService.search(searchValue);
}


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
  _spaService.showPage("#login");


  // Firebase UI indstillinger - her tilføjes mail, google og telefonløsningen
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
   firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    //Vis BUY som "startside"
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
  `;
}


function showLoader(show) {
  let loader = document.querySelector('#loader');
  if (show) {
    loader.classList.remove("hide");
  } else {
    loader.classList.add("hide");
  }

}
