 class SpaService {
   constructor(defaultPage) {
     this.defaultPage = defaultPage;
     this.pages = document.querySelectorAll(".sektion");
     this.navItems = document.querySelectorAll("#menu a");
     this.pageChange();
   }

   //SKJUL ALLE SIDER
   hideAllPages() {
     for (let page of this.pages) {
       page.style.display = "none";
     }
   }

   //LAVE FUNKTIONEN SHOWPAGE DER VISER SIDERNE
   showPage(pageId) {
     this.hideAllPages();
     document.querySelector(`#${pageId}`).style.display = "block";
     this.setActiveTab(pageId);
   }
   //sætter den aktive ID
   setActiveTab(pageId) {
     for (let navItem of this.navItems) {
       if (`#${pageId}` === navItem.getAttribute("href")) {
         navItem.classList.add("active");
       } else {
         navItem.classList.remove("active");
       }
     }
   }

   //NAGIVER TIL #SIDENS ID
   navigateTo(pageId) {
     window.location.href = `#${pageId}`;
   }

   //FUNKTIONEN DER SKIFTER SIDEN VED ÆNDRING..
   //denne kører efterfølgende funktionen der viser den nye side
   pageChange() {
     let page = this.defaultPage;
     if (window.location.hash) {
       page = window.location.hash.slice(1);
     }
     this.showPage(page);
   }

 }
 const spaService = new SpaService("buy");
 export default spaService;
