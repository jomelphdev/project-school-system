<script setup>
import Header from "./Header.vue";
import ReportBuilderUploader from "./ReportBuilderUploader.vue";
import ReportBuilderSetup from "./ReportBuilderSetup.vue";
import ReportBuilderPreview from "./ReportBuilderPreview.vue";
import ReportBuilderDownloader from "./ReportBuilderDownloader.vue";
import ButtonSubmit from "./ButtonSubmit.vue";
import RailRoad from "./RailRoad.vue";
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
        <Header label="Report Builder"></Header>

        <RailRoad
          :steps="steps"
          :activeStep="activeStep"
          :progressWidth="progressWidth"
        />

        <ReportBuilderUploader 
        @clicked="onClickChildUploader"
        :userData="userData"
        v-if="activeStep === 1"/>

        <ReportBuilderSetup
         :userData="userData"
         @clicked="onClickChildSetup" 
         :uploadData="fileData" 
         :sectionStatusUpdate="lockSections"
         :propReportName="reportName"
         v-else-if="activeStep === 2"/>

        <!-- <ReportBuilderPreview v-else-if="activeStep === 3"/> -->
        <ReportBuilderDownloader 
        :userData="userData" 
        :uploadData="setupData" 
        :downloadDataRptFile="listDataForDownload" 
        :reportNameFromSetup="reportName" 
        :originalSurveyName="originalSurveyName"
        :originalReportName="originalReportName"
        :isFileSRV="isFileSRV"
        v-else-if="activeStep === 3"/>

        <div class="railroad-controls">
          <ButtonSubmit
            id="progress-prev"
            class="btn"
            :disabled="activeStep === 1"
            @click="prevStep"
            label="Previous"
          />

          <!-- Hover for Report Builder Uploader next button -->
        <button
          class="tooltip"
          v-if="activeStep === 1 && fileData === null"
          :disabled="activeStep === 1 && fileData === null"
          label="Next"
        >
          Next
          <span class="tooltiptext"
            >You need to Upload a file first before you can proceed on setting up a report.</span
          >
        </button>
          <!-- Hover for Report Builder Uploader next button -->

        <ButtonSubmit
            v-if="activeStep === 1 && fileData !== null"
            id="progress-next"
            class="btn"
            @click="nextStep(); openLinkInNewTab();"
            label="Next"
          />

          <!-- Hover for Report Builder Setup next button -->
        <button
          class="tooltip"
          v-if="activeStep === 2 && setupData.length === 0 && lockSections === false"
          :disabled="activeStep === 2 && setupData.length === 0 && lockSections === false"
          label="Next"
        >
          Next
          <span class="tooltiptext"
            >You need to 'Lock Sections' first before you can proceed on downloading/generating a report file.</span
          >
        </button>
          <!-- Hover for Report Builder Setup next button -->


          <ButtonSubmit
            v-if="activeStep === 2 && setupData.length > 0 && lockSections === true"
            id="progress-next"
            class="btn"
            @click="nextStep"
            label="Next"
          />

          <ButtonSubmit
            v-if="activeStep === 3"
            id="progress-next"
            class="btn"
            :disabled="activeStep === steps.length"
            @click="nextStep"
            label="Next"
          />
          <!-- <ButtonSubmit
            v-if="fileData !== null"
            id="progress-next"
            class="btn"
            :disabled="activeStep === steps.length"
            @click="nextStep"
            label="Next"
          />
          <ButtonSubmit
            v-else
            id="progress-next"
            class="btn"
            :disabled="fileData === null"
            @click="nextStep"
            label="Next"
          /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  component: [
    Header,
    ReportBuilderDownloader,
    ReportBuilderPreview,
    ReportBuilderSetup,
    ReportBuilderUploader,
    ButtonSubmit,
    RailRoad,
  ],
  name: "ReportBuilder",
  props: ["userData", "brandData"],
  beforeCreate() {
    // console.log("Before Created");
    // console.log(this.userData);
  },
  created() {},
  beforeMount() {},
  mounted() {
    // this.onClickChild;
  },
  beforeUpdate() {},
  updated() {},
  beforeUnmount() {},
  unmounted() {},
  data: () => ({
    fileData: null,
    setupData: [],
    listDataForDownload: null,
    lockSections: false,
    reportName: null,
    originalSurveyName: '',
    originalReportName: '',
    isFileSRV: false,
    steps: [
      { content: "Upload" },
      { content: "Setup" },
      // { content: "Preview" },
      { content: "Finish" },
    ],
    activeStep: 1,
  }),
  computed: {
    //Use this functions for rail road********from here*******
    progressWidth() {
      return ((this.activeStep - 1) / (this.steps.length - 1)) * 100 + "%";
    },
    //***************to here*******************
    
  },
  methods: {
    //Use this functions for rail road********from here*******
    nextStep() {
      this.activeStep++;
      if (this.activeStep > this.steps.length) {
        this.activeStep = this.steps.length;
      }
    },
    prevStep() {
      this.activeStep--;
      if (this.activeStep < 1) {
        this.activeStep = 1;
      }
    },

    //***************to here*******************

    async onClickChildUploader(value) {
      this.fileData = value.file
      this.originalSurveyName = value.originalSurveyName
      this.originalReportName = value.originalReportName
      this.isFileSRV = value.isFileSRV
    },

    async onClickChildSetup(value) {
      console.log('from setup')
      console.log(value)
      this.setupData = value.sectionsGenerated
      this.fileData = value.rawJson
      this.listDataForDownload = value.rawJson
      this.lockSections = value.lockSections
      this.reportName = value.reportName
      // console.log('this is section name')
      // console.log(this.fileData)
    },

    openLinkInNewTab() {
      const url = 'https://wordhtml.com/'; 
      window.open(url, '_blank');
      window.focus();

    //   var a = document.createElement("a");    
    // a.href = "https://wordhtml.com/";    
    // var evt = document.createEvent("MouseEvents");    

    // //the tenth parameter of initMouseEvent sets ctrl key    
    // evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,true, false, false, false, 0, null);    
    // a.dispatchEvent(evt);
    }
  },
};
</script>


<style scoped>
.body-container {
  min-width: 75vw;
}
.railroad-controls {
  display: flex;
  justify-content: space-between;
  margin: 10px 0 10px 0;
}

.railroad-control {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}


.tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
  color: #959da5;
  padding: 6px 16px;
  background-color: #f4782042;
  border-color: rgba(27, 31, 35, 0.034);
  /* border: 1px solid rgba(27, 31, 35, 0.15); */
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: black;
  color: #ccc;
  text-align: center;
  border-radius: 6px;
  padding: 10px 10px;

  /* Position the tooltip */
  position: absolute;
  right: 75%;
  bottom: 100%;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

@media only screen and (min-width: 280px) and (max-width: 900px) {
  .body-container {
    min-width: 15vw;
  }
}
</style>
