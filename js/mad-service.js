import authService from "./auth.js";
import Loader from "./spinner.js";


class MadService {
  constructor() {
    this.foodRef = firebaseDB.collection("madretter");
    this.userRef = firebaseDB.collection("users");
    this.authUser;
    this.authUserRef;
    this.retter;
    this.read();
    this.loader = new Loader();
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
      this.loader.show(false);
    });
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

  //SØGEFUNKTONEN
  search(value) {
    let searchQuery = value.toLowerCase();
    let searchFood = [];
    for (let ret of this.retter) {
      let overskrift = ret.name.toLowerCase();
      if (overskrift.includes(searchQuery)) {
        searchFood.push(ret);
      }
    }
    this.appendFood(searchFood);
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
add_shopping_cart
</i> <p>Tilføj og gå til betaling</p></div>
</div>

</article>
    `;

    document.querySelector('#infomadboks').innerHTML = skabelon;
  }


  userHasAdded(favRetId) {
    if (authService.addedFood && authService.addedFood.includes(favRetId)) {
      return true;
    } else {
      return false;
    }
  }

  //Tilføj til kurven funktionen
  addToBasket(id) {
    authService.authUserRef.set({
      addedFood: firebase.firestore.FieldValue.arrayUnion(id)
    }, {
      merge: true
    });
  }

  //Fjern fra kurven funktionen
  removeFromBasket(id) {
    authService.authUserRef.update({
      addedFood: firebase.firestore.FieldValue.arrayRemove(id)
    });
  }

  //Henter og læser det tilføjede mad
  async getAddedFood() {
    let addedFood = [];
    if (authService.authUser.addedFood) {
      for (let id of authService.authUser.addedFood) {
        await this.foodRef.doc(id).get().then(function(doc) {
          let ret = doc.data();
          ret.id = doc.id;
          addedFood.push(ret);
        });
      }
    }
    return addedFood;
  }
  //Appender mad tilføjet til kurven.
  async appendAddFood() {
    let retter = await madService.getAddedFood();
    let kurvTemplate = "";
    for (let ret of retter) {
      kurvTemplate += `
<article class="kurven">
<i class="material-icons" onclick="removeFromBasket('${ret.id}')">close</i>
<h2>${ret.name}</h2>
<p><span class="bold">${ret.pris}</span>kr.</p>
</article>`;
    }

    if (retter.length === 0) {
      kurvTemplate = `
                <p>Tilføj venligst nogle retter</p>
            `;
    }
    document.querySelector('#pay').innerHTML = kurvTemplate;
  }

//ANDERS
  //Sætter mad ind på profil og på kvitteringen
  async appendFoodToProfile() {
    let retter = await madService.getAddedFood();
    let kvittering = "";
    let mineordre = "";
    let time = new Date();
    for (let ret of retter) {
      kvittering += `<article class="kvitten">
  <h2>1 * ${ret.name}</h2>
      `
      mineordre += `<article class="orders">
  <p>1 * ${ret.name} (${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()})</p>
      `
    }
    if (kvittering.length === 0) {
      kvittering = `
                      <h5>Noget gik galt.</h5>
                    <p>Gå venligst tilbage og prøv igen.</p>
                  `;
    }
    document.querySelector('#kvittering').innerHTML = kvittering;
    document.querySelector('#mineordre').innerHTML = mineordre;
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

  //LOGUD
  logout() {
    authService.logout();
  }

}
//Export class som madService
const madService = new MadService();
export default madService;
