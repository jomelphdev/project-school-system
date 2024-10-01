<script setup>
import Header from './Header.vue'
import Description from './Description.vue'
import ManageOrganisationBox from './ManageOrganisationBox.vue'
</script>

<template>
  <div style=" display: flex; flex-direction: column; justify-content: center; align-items: center;">
    <div class="body-container">
      <Header label="Manage organizations"></Header>
      <ManageOrganisationBox :userData="userData" :brandData="brandData" />
    </div>
  </div>
</template>

<script>
export default {
  component: [ManageOrganisationBox, Header, Description],
  props: {
    userData: Object,
    brandData: Object,
  },
  name: 'AdminDashboard',
  data() {
    return {}
  },
}
</script>

<style scoped>
.body-container {
  width: 80%;
}

@media only screen and (min-width: 280px) and (max-width: 900px) {
  .body-container {
    width: 80%;
    background: white;
    margin: 0;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    box-shadow: 0px 2px 10px -4px #000000;
    border-radius: 20px;
    align-self: center;
    font-size: 3.5vw;
  }
}
</style>
