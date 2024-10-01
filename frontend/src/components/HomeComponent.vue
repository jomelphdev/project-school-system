<script setup>
import SurveyBox from "./SurveyBox.vue";
import HomeSkillBuilding from "./HomeSkillBuilding.vue";
import HomeCohortReports from "./HomeCohortReports.vue";
import HomeFacultyReport from "./HomeFacultyReport.vue";
import HomeAdminTasks from "./HomeAdminTasks.vue";
import HomeReports from "./HomeReports.vue";
</script>

<template>
  <div class="body-form-container">
    <h3 class="message">
      Congratulations for investing in yourself. Use the following resources to
      guide your continuous development process.
    </h3>
    <div
      v-if="
        role.includes('10') ||
        role.includes('11') ||
        role.includes('12') ||
        role.includes('13') ||
        role.includes('14') ||
        role.includes('18')
      "
    >
      <HomeAdminTasks label="The following tasks are available for you" />
      <HomeSkillBuilding
        label="My Skill Building Actions"
        :userData="userData"
        :brandData="brandData"
        @passSubjectFullName="getSubjectFullName"
      />
      <HomeReports label="My Reports Available" :userData="userData" :brandData="brandData"/>
    </div>
    <div v-else-if="role !== ''">
      <HomeSkillBuilding
        label="My Skill Building Actions"
        :userData="userData"
        :brandData="brandData"
        @passSubjectFullName="getSubjectFullName"
      />
      <HomeReports label="My Reports Available" :userData="userData" :brandData="brandData"/>
      <br />
    </div>
    <div v-if="role.includes('4')">
      <HomeCohortReports
        reportName="5 Step Profile Report"
        surveyName="Big 5 Survey"
        dateTime="2022-03-23, 9:11:14 AM"
        buttonLabel="View report"
        buttonColor="#e67829"
        label="Your coaching reports available"
        :userData="userData"
        :brandData="brandData"
      />
      <br />
    </div>
    <div v-if="role.includes('5')">
      <HomeFacultyReport
        reportName="5 Step Profile Report"
        surveyName="Big 5 Survey"
        dateTime="2022-03-23, 9:11:14 AM"
        buttonLabel="View report"
        buttonColor="#e67829"
        label="Your faculty reports"
        :userData="userData"
        :brandData="brandData"
      />
      <br />
    </div>
  </div>
</template>
<script>
export default {
  props: ["userData", "brandData"],
  component: [
    SurveyBox,
    HomeSkillBuilding,
    HomeCohortReports,
    HomeFacultyReport,
    HomeAdminTasks,
    HomeReports,
  ],
  name: "HomeComponent",
  data: () => ({
    headerSubjectFullName: "",
  }),
  mounted() {},
  methods: {
    getSubjectFullName(data) {
      this.headerSubjectFullName = data;
      this.$emit("passHeaderSubjectFullName", this.headerSubjectFullName);
    },
  },
  computed: {
    role: function () {
      for (var key in this.userData) {
        if (key == "roles") {
          return this.userData[key];
        }
      }
      return "";
    },
  },
};
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  background: white;
  min-width: 75vw;
  width: 7vw;
  margin: auto;
  margin-bottom: 20px;
  margin-top: 20px;
  border-radius: 20px;
  padding: 20px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0px 2px 10px -4px #000000;
}

.message{
  text-align: center;
  padding: 10px;
}

@media only screen and (min-width: 280px) and (max-width: 540px) {
  .message {
    text-align: center;
    padding: 10px;
  }
}
</style>
