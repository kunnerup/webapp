import {
  firebaseDB
} from "./firebase-service.js";

export default class MadService {
  constructor() {
    this.userRef = firebaseDB.collection("users");
    this.read();
  }

  read() {
    // ========== READ ==========
    // watch the database ref for changes
    this.userRef.onSnapshot(snapshotData => {
      let users = [];
      snapshotData.forEach(doc => {
        let user = doc.data();
        user.id = doc.id;
        users.push(user);
      });
      this.appendUsers(users);
    });
  }

  // append users to the DOM
  appendUsers(users) {
    let htmlTemplate = "";
    for (let user of users) {
      htmlTemplate += `
      <article>
        <img src="${user.img}">
        <p><span class="bold">${user.name}</span><br>
        ${user.beskrivelse}<br>
        ${user.gram} g <br>
        ${user.pris} kr </p>

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
}
