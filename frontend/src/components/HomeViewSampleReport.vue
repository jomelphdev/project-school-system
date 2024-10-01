<script setup>
import api from "../api/api";
</script>

<template>
  <div class="box">
    <div class="modal-overlay" @click="$emit('close-modal')">
      <div class="modal-container">
        <div class="modal" @click.stop>
          <iframe
            :src="`${reportLink}?sex=${gender}&country=${country}&viewer_fullname=${viewerFullName}&report_for_fullname=${reportForFullName}&survey_assignment_id=${surveyAssignmentId}&org_id=${orgId}&subOrg_id=${suborg}&program_id=${programId}&iteration_id=${iterationId}&survey_template_id=${surveyTemplateId}&coach_id=${coachId}&suborg_name=${suborgName}&program_name=${programName}&iteration_name=${iterationName}`"
            frameborder="0"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeViewSampleReport",
  props: [
    "brandData",
    "userData",
    "surveyAssignmentId",
    "suborg",
    "orgId",
    "surveyTemplateId",
    "programId",
    "iterationId",
    "coachId",
    "reportForFullName",
    "viewerFullName",
    "reportLink",
    "programName",
    "suborgName",
    "iterationName",
    "faculty"
  ],
  components: [],
  async mounted() {
    if(!this.faculty){
      api
      .get(
        `survey-results-sex-country/${this.surveyAssignmentId}`
      )
      .then((res) => {
        this.gender = res.data[0].gender
        this.country = res.data[0].country
      });
    }
  },
  data: () => ({
    passedRouteParams: {},
    rand: "",
    gender: "",
    country: "",
  }),
};
</script>

<style scoped>
.icon-background1 {
  color: red;
  /* background-color: black; */
}
.fa-star {
  color: green;
}
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000b6;
  z-index: 1;
}

.modal-container {
  margin-top: 5%;
  height: 100vh;
  width: 90%;
  max-height: calc(100vh - 210px);
}

.modal {
  text-align: left;
  background-color: white;
  padding: 0 30px 0 30px; /* padding settings left and right */
  height: 100vh;
  max-height: calc(100vh - 120px);
  border-radius: 10px;
  overflow-y: auto;
}

button {
  background-color: #ac003e;
  width: 150px;
  height: 40px;
  color: white;
  font-size: 14px;
  border-radius: 16px;
  margin-top: 50px;
}

.box {
  align-self: center;
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0px 2px 10px -4px #000000;
}
#table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
}

#table td,
#table th {
  border: 1px solid #ddd;
  padding: 8px;
  /* word-break: word-wrap; */
}

#table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#table tr:hover {
  background-color: #ddd;
}

#table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #0e5071;
  color: white;
}

#table td {
  text-align: left;
  vertical-align: middle;
}

iframe {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  margin: 5px 0;
}
</style>