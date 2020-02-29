//SPINNEREN ANDERS
export default class Loader {
  constructor() {
    this.loader = document.getElementById('loadbox');
  }
  show(show) {
    if (show) {
      this.loader.classList.remove("hide");
    } else {
      this.loader.classList.add("hide");
    }
  }
}
