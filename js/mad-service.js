import {
  firebaseDB
} from "./firebase-service.js";

export default class MadService {
  constructor() {
    this.userRef = firebaseDB.collection("users");
    this.read();
  }

  read() {
    // SE DATABASEN OM DER ER ÆNDRINGER
    this.userRef.onSnapshot(snapshotData => {
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
        <img src="${ret.img}">
        <p><span class="bold">${ret.name}</span><br>
        ${ret.beskrivelse}<br>
        ${ret.gram} g <br>
        ${ret.pris} kr </p>
<div class="redslet"><p class="rediger">REDIGER</p><p class="slet" onclick="delete(id)">SLET</p></div>
      </article>
      `;
    }
    document.querySelector('#mad-container').innerHTML = htmlTemplate;
  }

  // TILFØJ NY PORTION - Rækkefølgen!
  create(img, name, beskrivelse, gram, pris) {
    this.userRef.add({
      img,
      name,
      beskrivelse,
      gram,
      pris
    });
  }

//SLET RET
delete(id) {
  this.userRef.doc(id).delete();
}
}
