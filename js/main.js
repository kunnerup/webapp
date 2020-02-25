"use strict";
import SpaService from "./spa.js";
import MadService from "./mad-service.js";

let _spaService = new SpaService("login");
let _madService = new MadService();
let _selectedFoodId = "";
let _selectedImgFile = "";
let _currentUser;

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
  document.querySelector('#madoverskrift').value = "";
  document.querySelector('#madbeskrivelse').value = "";
  document.querySelector('#gram').value = "";
  document.querySelector('#pris').value = "";
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
  window.deleteRet = (id) => {
    console.log(id);
    _madService.delete(id);
  }

  //LOG UD
  window.logout = () => {
        firebase.auth().signOut();
      }

      //MERE INFO OM maden
      window.showInfo = (id, name, beskrivelse, img, gram, pris) => {
        _spaService.navigateTo("info-om-ret");
      _madService.appendFoodInfo(id, name, beskrivelse, img, gram, pris);
      }

//SØGEFUNKTION


//UPDATE MADRETTER
//FØRST VALG AF MADRET og tilføjt til inputfelter
window.selectFood = (id, name, beskrivelse, img, gram, pris) => {
  // Vælger de "Nye" input felter til opdatereingen
  let imageInput = document.querySelector('#imagePreview-update');
  let nameInput = document.querySelector('#madoverskrift-update');
  let beskrivelseInput = document.querySelector('#madbeskrivelse-update');
  let gramInput = document.querySelector('#gram-update');
  let prisInput = document.querySelector('#pris-update');

  nameInput.value = name;
  beskrivelseInput.value = beskrivelse;
  imageInput.src = img;
  gramInput.value = gram;
  prisInput.value = pris;
  _selectedFoodId = id;
  _spaService.navigateTo("editfood");
}
//opdatere madretter
window.update = (id, name, beskrivelse, img, gram, pris) => {
  let imageInput = document.querySelector('#imagePreview-update');
  let nameInput = document.querySelector('#madoverskrift-update');
  let beskrivelseInput = document.querySelector('#madbeskrivelse-update');
  let gramInput = document.querySelector('#gram-update');
  let prisInput = document.querySelector('#pris-update');

  _madService.update(_selectedFoodId, imageInput.src, nameInput.value, beskrivelseInput.value, gramInput.value, prisInput.value);
  _spaService.navigateTo("buy");
}

//Tilføj til kurven
/*
window.addKurv = (id, name, pris) => {
  let nameKurv = document.querySelector('#madContainerOverskrift').textContent;
  let prisKurv = document.querySelector('#madContainerPris');

  _spaService.navigateTo("payment");
_madService.appendTilKurv(_selectedFoodId, nameKurv, prisKurv.textContent);
}*/


// append favourite movies to the DOM
async function appendAddFood(madIds = []) {
  let kurvTemplate = "";
  if (madIds.length === 0) {
    htmlTemplate = "<p>Tilføj ret</p>";
  } else {
    for (let madId of madIds) {
      await _foodRef.doc(madId).get().then(function(doc) {
        let mad = doc.data();
        ret.id = doc.id;
        htmlTemplate += `
        <article>
          <h2>${ret.name} </h2>
          <button onclick="removeFromFavourites('${movie.id}')" class="rm">Remove from favourites</button>
        </article>
      `;
      });
    }
  }
  document.querySelector('#pay').innerHTML = kurvTemplate;
}

// adds a given movieId to the favMovies array inside _currentUser
window.addToFavourites=(madId) => {
  showLoader(true);
    _spaService.navigateTo("payment");
  _madService.foodRef.doc(_currentUser.uid).set({
    addedFood: firebase.firestore.FieldValue.arrayUnion(madId)

  }, {
    merge: true

  });
}

// removes a given movieId to the favMovies array inside _currentUser
function removeFromFavourites(madId) {
  showLoader(true);
  _madService.foodRef.doc(_currentUser.uid).update({
    addedFood: firebase.firestore.FieldValue.arrayRemove(madId)
  });
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
  _spaService.showPage("login");


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



function appendUserData(user) {
  document.querySelector('#profil').innerHTML += `
  <br><h2>${user.displayName}</h2>
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



//MAPBOX
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9uYTU1MDgiLCJhIjoiY2syMDZ5bXBtMDBuZTNlcXpvbnozYzJuZSJ9.Wo5gS17JDQ8hYPQ82hQlgA';
let map = new mapboxgl.Map({
container: 'map', // MAP ID (HTML)
style: 'mapbox://styles/mapbox/streets-v11',
center: [10.203921, 56.162939], // START POSITION
zoom: 13 // START ZOOM
});

// Add geolocate control to the map.
map.addControl(
new mapboxgl.GeolocateControl({
positionOptions: {
enableHighAccuracy: true
},
trackUserLocation: true
})
);
