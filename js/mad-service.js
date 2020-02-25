import {
  firebaseDB
} from "./firebase-service.js";

export default class MadService {
  constructor() {
    this.foodRef = firebaseDB.collection("users");
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
        ${ret.pris} kr </p>
<div class="redslet">
<p class="rediger" onclick="selectFood('${ret.id}','${ret.name}', '${ret.beskrivelse}', '${ret.img}', '${ret.gram}', '${ret.pris}')">REDIGER</p>
<p class="slet" onclick="deleteRet('${ret.id}')">SLET</p>
</div>
      </article>
      `;
    }
    document.querySelector('#mad-container').innerHTML = htmlTemplate;
  }


  // MERE DETALJERET INFO
  appendFoodInfo(id, name, beskrivelse, img, gram, pris) {
    console.log(id, name, beskrivelse, img, gram, pris);
    let skabelon = `
    <article class="foodinfo">
    <a href="#buy"><div class="returnbuy"><i class="material-icons">close</i></div></a>

<h2 span="bold">${name}</h2>
<br>
  <img src="${img}">
<br>
<p><span class="darkgreen">Beskrivelse</span>
<br>
${beskrivelse}</p>
<br>
<p><i class="material-icons">star</i> <i class="material-icons">star</i> <i class="material-icons">star</i> <i class="material-icons">star</i> <i class="material-icons">star_border</i></p>

<div class="muligheder">
<div><i class="material-icons">
add_box
</i> <p>Tilføj og søg videre</p></div>
<div><i class="material-icons">add_shopping_cart</i>
<p>Køb portion</p></div>

</div>

</article>
    `;

    document.querySelector('#infomadboks').innerHTML = skabelon;
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
update(id, img, name, beskrivelse, gram, pris){
let foodToUpdate = {
  img: img,
  name: name,
  beskrivelse: beskrivelse,
  gram: gram,
  pris: pris
};
this.foodRef.doc(id).set(foodToUpdate);
}


logout() {
authService.logout();
}
}
