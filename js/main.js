//   --->   Alt uden navn er fællesskabt i gruppen  <----

"use strict";
import spaService from "./spa.js";
import madService from "./mad-service.js";
import authService from "./auth.js";


let _selectedFoodId = "";
let _selectedImgFile = "";

//FÅR SIDEN TIL AT SKIFTE NÅR DER KLIKKES
window.pageChange = function() {
  spaService.pageChange();
}

authService.init();


window.logout = () => {
  authService.logout();
  spaService.navigateTo("login");
}

//CREATE MAD (JONAS)
window.createFood = () => {
  // Finder inputfelterne
  let imageInput = document.querySelector('#imagePreview');
  let nameInput = document.querySelector('#madoverskrift');
  let beskrivelseInput = document.querySelector('#madbeskrivelse');
  let gramInput = document.querySelector('#gram');
  let prisInput = document.querySelector('#pris');

  madService.create(imageInput.src, nameInput.value, beskrivelseInput.value, gramInput.value, prisInput.value);
  spaService.navigateTo("buy");
  document.querySelector('#madoverskrift').value = "";
  document.querySelector('#madbeskrivelse').value = "";
  document.querySelector('#gram').value = "";
  document.querySelector('#pris').value = "";
  document.querySelector('#img').value = "";
  document.querySelector('#imagePreview').src = "";
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
  }
}

//DELETE MAD
window.deleteRet = (id) => {
  madService.delete(id);
}


//MERE INFO OM maden
window.showInfo = (id, name, beskrivelse, img, gram, pris) => {
  spaService.navigateTo("info-om-ret");
  madService.appendFoodInfo(id, name, beskrivelse, img, gram, pris);

}


window.addToBasket = (id) => {
  madService.addToBasket(id);
  spaService.navigateTo("payment");
}

//ANDERS
window.makePay = (id) => {
  madService.appendFoodToProfile();
  spaService.navigateTo("succes");
}

window.search = (searchValue) => {
  madService.search(searchValue);
}

window.removeFromBasket = (id) => {
  madService.removeFromBasket(id);
  madService.appendAddFood();
}

window.appendAuthUser = (id) => {
  authService.appendAuthUser(id, name, beskrivelse, img, gram, pris);
}






//UPDATE MADRETTER (ANDERS)
//FØRST VALG AF MADRET og tilføjt til inputfelter
window.selectFood = (id, name, beskrivelse, img, gram, pris) => {
  // Vælger de "Nye" input felter til opdatereingen
  let imageInput = document.querySelector('#imagePreview-update');
  let nameInput = document.querySelector('#madoverskrift-update');
  let beskrivelseInput = document.querySelector('#madbeskrivelse-update');
  let gramInput = document.querySelector('#gram-update');
  let prisInput = document.querySelector('#pris-update');

  //Indstiller værdien i inputfelterne
  nameInput.value = name;
  beskrivelseInput.value = beskrivelse;
  imageInput.src = img;
  gramInput.value = gram;
  prisInput.value = pris;
  _selectedFoodId = id;
  spaService.navigateTo("editfood");
}
//opdatere madretter
window.update = (id, name, beskrivelse, img, gram, pris) => {
  let imageInput = document.querySelector('#imagePreview-update');
  let nameInput = document.querySelector('#madoverskrift-update');
  let beskrivelseInput = document.querySelector('#madbeskrivelse-update');
  let gramInput = document.querySelector('#gram-update');
  let prisInput = document.querySelector('#pris-update');

  madService.update(_selectedFoodId, imageInput.src, nameInput.value, beskrivelseInput.value, gramInput.value, prisInput.value);
  spaService.navigateTo("buy");
}


//MAPBOX - KODEN ER AUTOMATISK OPRETTET AF MAPBOX - KUN TOKEN OG STARTPOSITION ER ÆNDRET
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9uYTU1MDgiLCJhIjoiY2syMDZ5bXBtMDBuZTNlcXpvbnozYzJuZSJ9.Wo5gS17JDQ8hYPQ82hQlgA'; //Vores acceptoken
let map = new mapboxgl.Map({
  container: 'map', // MAP-ID (HTML)
  style: 'mapbox://styles/mapbox/streets-v11', //stylesheetet
  center: [10.203921, 56.162939], // START POSITION
  zoom: 13 // START ZOOM
});

//Finder ud af hvor brugeren er og brug dette til lokation ved tryk
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  })
);
