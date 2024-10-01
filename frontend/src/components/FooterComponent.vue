<script setup>
import api from "../api/api";
// import { flashMessage } from "../functions.js";
</script>

<template>
  <div class="footer-text-color">
    <footer class="footer-child">
      <div id="footer-links" class="flex">
        <a :href="dynamicDomain">Terms of Service</a>
        <router-link to="/privacy_page">Privacy Policy</router-link>
      </div>
      <div id="powered-by">
        <div><a :href="dynamicDomain" >Powered by TalentSage © {{ currentYear }}</a></div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data: () => ({
    currentYear: 0,
    myDomain: document.domain,
    dynamicDomain: ""
  }),
  async mounted(){
    
    await api.get('brands/'+this.myDomain).then((result) => {
      console.log(result.data)
      this.dynamicDomain = result.data[0].website_terms_url
    });

    console.log(this.dynamicDomain)

    this.currentYear = new Date().getFullYear()
  },
};
</script>

<style>
#footer-links a {
  padding: 10px;
  /* If you want to implement it in very old browser-versions */
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */

  /* The rule below is not implemented in browsers yet */
  -o-user-select: none;

  /* The rule below is implemented in most browsers by now */
  user-select: none;
}

#powered-by a {
  padding-right: 20px;
  /* If you want to implement it in very old browser-versions */
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */

  /* The rule below is not implemented in browsers yet */
  -o-user-select: none;

  /* The rule below is implemented in most browsers by now */
  user-select: none;
}

.footer-child {
  height: 40px;
  height: 100%;
  border-top: 2px solid #ccc;
  display: flex;
  padding: 20px 0 0 0;
  flex-wrap: wrap;
  font-size: 90%;
  justify-content: space-between;
  min-width: 100%;
  bottom: 0;
  margin: 0 0 20px 0;
}

@media only screen and (min-width: 280px) and (max-width: 540px) {
  .footer-child {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 0 20px 0;
  }
  #powered-by a {
    padding: 0;
  }
}
</style>
