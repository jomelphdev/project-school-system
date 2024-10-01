<script setup>
import Header from "./Header.vue";
import Description from "./Description.vue";
import AdminDashboardBox from "./AdminDashboardBox.vue";
</script>

<template>
  <div class="body-container">
    <div>
      <div>
        <Header class="header" label="Iteration Control Center"></Header>
        <Description label=""></Description>
        <AdminDashboardBox :userData="userData" :brandData="brandData" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  component: [AdminDashboardBox, Header, Description],
  name: "AdminDashboard",
  props: ["userData", "brandData"],
  data() {
    return {};
  },
  mounted() {},
};
</script>


<style scoped>
.body-container {
  background: white;
  margin: 20px;
  padding: 40px;
  box-shadow: 0px 2px 10px -4px #000000;
  border-radius: 20px;
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media only screen and (min-width: 280px) and (max-width: 900px) {
  .header {
    font-size: 4vw;
    width: 98%;
    background: white;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    position: relative;
    align-items: center;
  }
  .body-container {
    font-size: 2.5vw;
    padding: 10px;
    margin: 10px;
    background: white;
    box-shadow: 0px 2px 10px -4px #000000;
    border-radius: 20px;
    align-self: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>