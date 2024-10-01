<script setup>
import ButtonSubmit from "./ButtonSubmit.vue";
</script>

<template>
  <div class="main-div">
    <div class="label-div">
      <div>
        <strong>{{ label }}</strong>
      </div>
      <button
        class="label-btn"
        @click.prevent="toggle = !toggle"
        v-show="!toggle"
      >
        Show
      </button>
      <button
        class="label-btn"
        @click.prevent="toggle = !toggle"
        v-show="toggle"
      >
        Hide
      </button>
    </div>
    <div class="box-div" v-show="toggle">
      <div class="box">
        <h2>Find / Add / Edit User</h2>
        <br />

        <ButtonSubmit label="See More" @click="goTo('manage_user')" />
      </div>

      <div class="box">
        <h2>Iteration Control Center</h2>
        <br />

        <ButtonSubmit label="See More" @click="goTo('AdminDashboard')" />
      </div>

      <div class="box">
        <h2>Add Users</h2>

        <br />

        <ButtonSubmit label="See More" @click="goTo('upload_many_users_at_once')" />
      </div>

      <div class="box">
        <h2>Add Individual Survey</h2>
        <br />

        <ButtonSubmit label="See More" @click="goTo('Add_survey')"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeAdminTasks",
  props: {
    reportName: String,
    surveyName: String,
    dateTime: String,
    buttonLabel: String,
    buttonColor: String,
    label: String,
  },
  data: () => ({
    toggle: true,
  }),
  methods: {
    goTo(route) {
      this.$router.push({
        name: route,
      });
    },
  },
  components: { ButtonSubmit },
};
</script>

<style scoped>
.main-div {
  min-width: 75vw;
  margin: 15px;
}
.label-btn {
  color: #fff;
  background-color: #0e5071;
}
.label-div {
  padding: 10px;
  border: 1px solid #0e5071;
  background-color: #0e5071;
  color: #fff;
  display: flex;
  justify-content: space-between;
}
.box-div {
  display: flex;
  flex-wrap: wrap;
}
.box {
  border: 3px solid #888;
  border-radius: 10px;
  font: -webkit-control;
  margin: 20px 10px;
  padding: 10px;
  box-shadow: 2px 4px #ccc;
  min-height: 150px;
  min-width: 205px;
  max-width: 205px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.btn {
  width: 100%;
}

@media only screen and (min-width: 280px) and (max-width: 540px) {
  .main-div{
    margin: 0 5px 0 5px;
  }
}
</style>
