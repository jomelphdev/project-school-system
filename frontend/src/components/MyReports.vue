<script setup>
import MyReportsBox from "./MyReportsBox.vue";
</script>

<template>
  <div class="body-container">
    <h1 style="text-align: center">{{ screenName }}</h1>
    <div style="display: flex; justify-content: center; align-items: center">
      <MyReportsBox
        reportName="5 Step Profile Report"
        surveyName="Big 5 Survey"
        dateTime="2022-03-23, 9:11:14 AM"
        buttonLabel="View report"
        buttonColor="#e67829"
      />
      <MyReportsBox
        reportName="360 Leadership Feedback Report"
        surveyName="360 Survey"
        dateTime="2022-03-23, 9:10:43 AM"
        buttonLabel="View report"
        buttonColor="#e67829"
      />
    </div>
  </div>
</template>

<script>
export default {
  component: [MyReportsBox],
  screenName: "My reports",
  data() {
    return {};
  },
};
</script>

<style scoped></style>
