<script setup>
import Header from "./Header.vue";
import Description from "./Description.vue";
import CoachingReportsBox from "./CoachingReportsBox.vue";
</script>

<template>
  <div class="body-form-container">
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      "
    >
      <div>
        <Header label="Coaching reports"></Header>
        <Description
          label="Welcome to your personal report dashboard. It contains all the reports you have access to for all groups you are supporting."
        ></Description>
        <CoachingReportsBox />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  component: [Header, Description, CoachingReportsBox],
  name: "CoachingReports",
  data() {
    return {};
  },
};
</script>

<style scoped></style>
