import spaService from "./spa.js";
import madService from "./mad-service.js";


class AuthService {
  constructor() {
    this.ui = new firebaseui.auth.AuthUI(firebase.auth());
    this.userRef = firebaseDB.collection("users");
    this.authUser;
    this.authUserRef;
  }
  init() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) { // Hvis brugeren er logget rigtigt ind, så:
        this.userAuthenticated(user);
      } else { // hvis brugeren ikke er logget korrekt ind, så:
        this.userNotAuthenticated();
      }
    });
  }
  userAuthenticated(user) {
    this.hideMenu(false);
    this.initAuthUserRef();
  }
  //HVIS BRUGEREN IKKE FINDES
  userNotAuthenticated() {
    this.hideMenu(true);
    spaService.showPage("login");

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
    this.ui.start('#firebaseui-auth-container', uiConfig);
  }



  initAuthUserRef() {
    let authUser = firebase.auth().currentUser;
    this.authUserRef = firebaseDB.collection("users").doc(authUser.uid);
    //USER DATA OG ADDEDFOOD
    this.authUserRef.onSnapshot({
      includeMetadataChanges: true
    }, userData => {
      if (!userData.metadata.hasPendingWrites && userData.data()) {
        let user = {
          ...authUser,
          ...userData.data()
        };
        this.authUser = user;
        this.appendAuthUser();
        madService.appendAddFood();
      }

    });
  }

  //LOGUD
  logout() {
    firebase.auth().signOut();
  }

  //APPEND BRUGERENS DATA PÅ PROFILSIDEN
  appendAuthUser() {
    document.querySelector('#profilinfo').innerHTML = `
  <br><h2>${this.authUser.displayName}</h2>
   <p>${this.authUser.email}</p>
  `;
  }

  //VIS/SKJUL MENUEN
  hideMenu(hide) {
    let menu = document.querySelector('#menu');
    if (hide) {
      menu.classList.add("hide");
    } else {
      menu.classList.remove("hide");
    }
  }
}
const authService = new AuthService();
export default authService;
