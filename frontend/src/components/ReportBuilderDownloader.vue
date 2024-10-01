<script setup>
import Header from "./Header.vue";
import Individual360Report from "./ReportBuilderTypes/Individual360Report.vue";
import ButtonSubmit from "./ButtonSubmit.vue";
import api from '../api/api'
import Swal from "sweetalert2";
</script>

<template>
  <div class="body-container">
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      "
    >
      <div>
        <Header
          label="You have successfully created/edited a report,
           Please download and keep the .rpt file for version control and finally 
           Generate Report HTML by clicking Generate."
        ></Header>
      </div>
    </div>

    <br /><br />
    <div>
      <div>

        <label for="rpt-btn">Download .rpt file</label> 
        <br>
        <ButtonSubmit
        id="rpt-btn"
          class="btn"
          @click="downloadRPT"
          label="Download"
        />
      </div>

      <hr class="container-middle-line">

      <div>

        <label for="html-btn">Generate HTML</label> 
        <br>
        <ButtonSubmit
          id="html-btn"
          class="btn"
          @click="downloadHTML"
          label="Generate"
        />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  component: [Header, ButtonSubmit],
  name: "ReportBuilderDownloader",
  props: ["userData", "brandData", "uploadData", "downloadDataRptFile", "reportNameFromSetup", "originalSurveyName", "originalReportName", "isFileSRV"],
  beforeCreate() {},
  async created() {
    console.log(this.uploadData)
    if(this.uploadData){
      this.downloadDataForHTML = JSON.stringify(this.uploadData)
    }

    if(this.downloadDataRptFile){
      this.downloadRptFile = this.downloadDataRptFile
    }

    if(this.reportNameFromSetup){
      this.reportFileName = this.reportNameFromSetup
    }

    // console.log(this.downloadDataForHTML)
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeUnmount() {},
  unmounted() {},
  data: () => ({
    downloadData: null,
    downloadDataForHTML: null,
    downloadRptFile: null,
    reportFileName: null,
    reportFileNameWithoutTags: null,
    surveyData: [{
      Type: "",
      QuestionNumber: "",
      Text: "",
      Template: "",
      Tag: 0,
    }],
    displaysurveyData: "",
    file: null,
    csvFile: null,
    parsedData: [],
    finalHTML: "",
  }),
  methods : {
    downloadHTML() {
      if(this.isFileSRV) {
        this.createNewReportTemplate()
      }
      else {
        this.updateReportTemplate()
      }
    },  
    async createNewReportTemplate() {
      // get survey_template_id by originalSurveyName or uploaded srv file
      try {
        const res = await api.get(`survey-templates/${this.originalSurveyName}`)
        if (res.data.status == 1) {
          this.changeReportFileName()

          const reportTemplateData = {
            "report_template_name": this.reportFileNameWithoutTags,
            "report_description": '',
            "report_file": this.reportFileNameWithoutTags+ ".html",
            "survey_template_id": res.data.survey_template_id,
            "tag_type": null,
            "is_coach_report": 0,
            "is_group_report": 0,
            "is_faculty_report": 0,
            "created_by": this.userData.ind_id,
            "modified_by": this.userData.ind_id
          }

          // check report template name if already exist
          try {
            const res = await api.get(`report-template-check-exist/${this.reportFileNameWithoutTags}`)
            if (res.data.status == 1) {
              console.log('download html');
              this.addReportTemplate(reportTemplateData)
            }
            else {
              Swal.fire({
                title: res.data.message,
                text: 'Please change the report name.',
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Ok",
              })
            }
          } catch (error) {
            console.log('something went wrong');
          }
        }
        else {
          Swal.fire({
            title: res.data.message,
            text: 'Please contact help@talentsage.com',
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Ok",
          })
        }
      } catch (error) {
        console.log('something went wrong');
      }
    },
    async addReportTemplate(data) {
      try {
        const res = await api.post('report-template', data)
        if (res) {
          Individual360Report.methods.individual360Funct(this.downloadDataForHTML, this.reportFileNameWithoutTags+ ".html", this.userData.org_id)
        }
        else {
          Swal.fire({
            title: "Something went wrong!",
            text: 'Please try again later or contact help@talentsage.com',
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Ok",
          })
        }
      } catch (error) {
        console.log('something went wrong');
      }
    },
    async updateReportTemplate() {
      this.changeReportFileName()

      const reportTemplateData = {
        "report_template_name": this.reportFileNameWithoutTags,
        "report_file": this.reportFileNameWithoutTags+ ".html",
        "modified_by": this.userData.ind_id,
        "orig_report_template_name": this.originalReportName,
      }
      try {
        const res = await api.put('report-template', reportTemplateData)
        if (res) {
          console.log('update data');
          Individual360Report.methods.individual360Funct(this.downloadDataForHTML, this.reportFileNameWithoutTags+ ".html", this.userData.org_id)
        }
        else {
          Swal.fire({
            title: "Something went wrong!",
            text: 'Please try again later or contact help@talentsage.com',
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Ok",
          })
        }
      } catch (error) {
        console.log('something went wrong');
      }
    },
    downloadRPT() {
      this.changeReportFileName()
      const items = this.downloadRptFile;
      var hiddenElement = document.createElement("a");
      hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURIComponent(JSON.stringify(items));
      hiddenElement.target = "_blank";
      hiddenElement.download = this.reportFileNameWithoutTags+ ".rpt";
      hiddenElement.click();
    },
    changeReportFileName() {
      // Remove <h2> and </h2> tags using regular expressions
      this.reportFileNameWithoutTags = this.reportFileName.replace(/<\/?h2>/g, '');
    }
  }
};
</script>


<style scoped>
.body-container {
  padding: 20px 20px 20px 20px;
  /* box-shadow: none; */
}

.header {
  font-size: 15px;
}

.container-middle-line{
  margin: 30px 0;
}

.btn{
  background-color: lightseagreen;
}
</style>