import authService from "./auth.js";


class MadService {
  constructor() {
    this.foodRef = firebaseDB.collection("madretter");
    this.userRef = firebaseDB.collection("users");
    this.authUser;
    this.authUserRef;
    this.read();
  }

  read() {
    // SE DATABASEN OM DER ER ÆNDRINGER
    this.foodRef.onSnapshot(snapshotData => {
      let retter = [];
      snapshotData.forEach(doc => {
        let ret = doc.data();
        ret.id = doc.id;
        retter.push(ret);
      });
      this.appendFood(retter);
    });
  /*  this.appendToBasket()*/
  }


  // SENDER MADRETTER TIL DOMMEN
  appendFood(retter) {
    let htmlTemplate = "";
    for (let ret of retter) {
      htmlTemplate += `
      <article>
        <img onclick="showInfo('${ret.id}','${ret.name}', '${ret.beskrivelse}', '${ret.img}', '${ret.gram}', '${ret.pris}')" src="${ret.img}">
        <p><span class="bold">${ret.name}</span><br>
        <i class="material-icons">star</i> <i class="material-icons">star</i> <i class="material-icons">star</i> <i class="material-icons">star</i> <i class="material-icons">star_border</i><br>
        ${ret.gram} g <br>
      <span class="bold">  ${ret.pris} kr </span> </p>
<div class="redslet">
<p class="rediger" onclick="selectFood('${ret.id}','${ret.name}', '${ret.beskrivelse}', '${ret.img}', '${ret.gram}', '${ret.pris}')">REDIGER</p>
<p class="slet" onclick="deleteRet('${ret.id}')">SLET</p>
</div>
      </article>
      `;
    }
    document.querySelector('#mad-container').innerHTML = htmlTemplate;
  }


  // MERE DETALJERET INFO OM RETTERNE
  appendFoodInfo(id, name, beskrivelse, img, gram, pris) {
    console.log(id, name, beskrivelse, img, gram, pris);
    let skabelon = `
    <article class="foodinfo">
    <a href="#buy"><div class="returnbuy"><i class="material-icons">close</i></div></a>

<h2 id="madContainerOverskrift" span="bold">${name}</h2>
<br>
  <img id="madContainerImg" src="${img}">
<br>
<p><span class="darkgreen">Beskrivelse</span>
<br>
${beskrivelse}</p>
<br>
<p><i class="material-icons">star</i> <i class="material-icons">star</i> <i class="material-icons">star</i> <i class="material-icons">star</i> <i class="material-icons">star_border</i></p>
<p id="madContainerPris" <span class="bold">${pris}kr.</span></p>
<div class="muligheder">
<div><i class="material-icons" onclick="addToBasket('${id}')">
add_box
</i> <p>Tilføj og søg videre</p></div>
<div><i class="material-icons">add_shopping_cart</i>
<p>Køb portion</p></div>

</div>

</article>
    `;

    document.querySelector('#infomadboks').innerHTML = skabelon;
  }
/*
//Tilføjer den valgte portion til kurven
appendTilKurv(id, nameKurv, imageKurv, prisKurv) {
  console.log(id, nameKurv, imageKurv, prisKurv);
  let kurvTemplate = "";
  kurvTemplate += `
  <article class="kurven">
  <a href="#buy"><div class="returnbuy"><i class="material-icons">close</i></div></a>

  <h2 span="bold">${nameKurv}</h2>

  </article>
    `;

  document.querySelector('#pay').innerHTML = kurvTemplate;
}
*/


userHasAdded(favRetId){
  if(authService.addedFood && authService.addedFood.includes(favRetId)){
    return true;
  }
  else{
    return false;
  }
}
addToBasket(id, name, beskrivelse, img, gram, pris){
  spaService.navigateTo("buy");
  authService.authUserRef.set({
    addedFood: firebase.firestore.FieldValue.arrayUnion(id, name, beskrivelse, img, gram, pris)
  }, {
    merge: true
  });
}

removeFromBasket(id, name, beskrivelse, img, gram, pris){
  authService.authUserRef.update({
    addedFood: firebase.firestore.FieldValue.arrayRemove(id, name, beskrivelse, img, gram, pris)
  });
}
async getAddedFood(id, name, beskrivelse, img, gram, pris){
  let addedFood = [];
  if (authService.addedFood){
  for (let id of authService.addedFood){
    await authService.userRef.doc(madId).get().then(function (doc){
      let ret = doc.data();
      ret.id = doc.id;
      addedFood.push(ret);
    });
  }
}
return addedFood;
}

async appendAddFood(id, name, beskrivelse, img, gram, pris){
  let retter = await madService.getAddedFood(id, name, beskrivelse, img, gram, pris);
  let kurvTemplate = "";
  for (let ret of retter){
    kurvTemplate +=`
<article>
<i class="material-icons" onclick="removeFromBasket(${ret.id}, name, beskrivelse, img, gram, pris)">close</i>
<h2>${ret.name}</h2>
<p><span class="bold">${ret.pris}</span></p>
</article>
    `
  }
  if(retter.length === 0){
    kurvTemplate = `
    <article>
<h3>Tilføj venligst en ret</h3>

    </article>`;
  }
  document.querySelector('#pay').innerHTML = kurvTemplate;
}

  // TILFØJ NY PORTION - Rækkefølgen!
  create(img, name, beskrivelse, gram, pris) {
    this.foodRef.add({
      img,
      name,
      beskrivelse,
      gram,
      pris
    });
  }

  //SLET RET
  delete(id) {
    this.foodRef.doc(id).delete();
  }


  //OPDATER MADRETTER
  update(id, img, name, beskrivelse, gram, pris) {
    let foodToUpdate = {
      img: img,
      name: name,
      beskrivelse: beskrivelse,
      gram: gram,
      pris: pris
    };
    this.foodRef.doc(id).set(foodToUpdate);
  }
  //tilføj til kurv
  /*
  addKurv(id, img, nameKurv, beskrivelse, gram, pris){
  let addToKurv = {
    img: img,
    name: nameKurv,
    beskrivelse: beskrivelse,
    gram: gram,
    pris: pris
  };
  this.foodRef.doc(id).add(addToKurv);
  }
  */
  logout() {
    authService.logout();
  }
}

const madService = new MadService();
export default madService;
