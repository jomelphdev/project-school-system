<template>
  <div class="main-container">
    <div class="page-header">
      <p>
        You have successfully created/edited a survey. Please download and keep
        the .srv file for version control and finally generate the HTML by
        clicking generate
      </p>
    </div>
    <div class="buttons-container">
      <div class="button-container">
        <p>Download SurveyName.srv</p>
        <button-submit
          label="Download"
          @click="downloadSurveyFile"
        ></button-submit>
      </div>
      <div class="button-container">
        <p>Generate HTML</p>
        <button-submit
          label="Generate"
          @click="generateHtmlOutput"
        ></button-submit>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../../api/api.js";
import ButtonSubmit from "../ButtonSubmit.vue";
import SurveyBuilderGenerator from "./SurveyBuilderGenerator.vue";
export default {
  components: {
    ButtonSubmit,
  },
  props: ["surveyData", "jsonData", "surveyName", "prepopulateData", "participantSurveyId", "indId"],
  data() {
    return {
      downloadData: null,
      displaysurveyData: "",
    };
  },
  methods: {
    downloadSurveyFile() {
      const data = this.surveyData.find((e) => e.name === "Competencies");
      let hiddenElement = document.createElement("a");
      hiddenElement.href =
        "data:text/csv;charset=utf-8," +
        encodeURIComponent(JSON.stringify(this.surveyData));
      hiddenElement.target = "_blank";
      hiddenElement.download = `${data.surveyName}.srv`;
      hiddenElement.click();
    },
    async generateHtmlOutput() {
      let surveyFilename = this.surveyName.replace(/\s/g, "-");
      try {
        const res = await api.post(`/survey-templates`, {
          survey_version: 2,
          survey_template_name: this.surveyName,
          survey_description: '' ,
          survey_file: `${surveyFilename}.html`,
          survey_type: 2,
          prepopulate_data: JSON.stringify(this.prepopulateData),
          created_by: 0,
          modified_by: 0,
        });
        if (res.status === 200 && this.participantSurveyId !== null) { 
          await api.put(`/survey-template/nominee-survey-template-id/${this.participantSurveyId}`, {
            nominee_survey_template_id: res.data.insertId,
            modified_by: this.indId,
          })
        }
      } catch (error) {
        console.log(error)
      }
      console.log(this.prepopulateData)
      this.displaysurveyData = JSON.stringify(this.jsonData);
      SurveyBuilderGenerator.methods.generateHtml(
        this.displaysurveyData,
        `${surveyFilename}.html`
      );
    },
  },
  computed: {},
};
</script>
<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 5em;
  font-weight: bold;
}
.buttons-container {
  height: 30vh;
}
.button-container {
  margin: 40px 0px;
}
</style>