<script setup>
import Header from './Header.vue';
import Description from './Description.vue';
import EmailTemplatesBox from './EmailTemplatesBox.vue';


</script>

<template>
  <div class="body-container">
    <Header label="Manage Templates" class="email-template-header"></Header>
    <Description label=""></Description>
    <EmailTemplatesBox :userData="userData" :brandData="brandData" />
  </div>
</template>

<script>
export default {
  component: [EmailTemplatesBox, Header, Description],
  name: 'AdminDashboard',
  props: {
    userData: Object,
    brandData: Object,
  },
  data() {
    return {
    }
  }
}
</script>


<style scoped>
.email-template-header {
  padding: 30px;
  margin: 0;
  color: #2a2929;
}

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