<script setup>
import Header from "./Header.vue";
import draggable from "vuedraggable";
import DescriptionInline from "./DescriptionInline.vue";
import ButtonSubmit from "./ButtonSubmit.vue";
import Swal from "sweetalert2";
</script>

<template>
  <div class="body-container">
    <div class="report-name-container">
      <label for="Report Name"
        ><DescriptionInline label="Report Name:"
      /></label>
      <input
        v-if="list.length >= 1"
        type="text"
        class="report-name-input input"
        :disabled="lockSections === true"
        v-model="list[0].subElements[5].Text"
      />
    </div>

    <div class="confidential-header-container">
      <input
        v-if="list.length >= 1"
        value="Confidential. Being viewed by:"
        placeholder="Confidential. Being viewed by:"
        type="text"
        class="report-name-input input"
        :disabled="lockSections === true"
        @input="changeInputDetails($event, list[0].subElements[6].subId, list[0].subElements[6].Type)"
      />
    </div>

    <div class="confidential-header-container">
      <textarea name="" id="" cols="40" rows="2"
      v-if="list.length >= 1"
      class="report-name-input input"
      :disabled="lockSections === true"
      :placeholder="list[0].subElements[7].Text"
      v-model="list[0].subElements[7].Text"
      >
      </textarea>
    </div>

    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      "
    >
      <!-- {{ sectionName }} -->
      <!-- {{ list.graphChoices }} -->
      <div class="body-container">
        <Header label="Display:"></Header>
        <div class="display">
          <div>
            <p>Cohort Data</p>
            <label class="switch" v-if="lockSections === false">
              <!-- <input type="checkbox" true-value="1" false-value="0" /> -->
              <input v-if="list.length >= 1"
                type="checkbox"
                :checked="list[0].subElements[0].isChecked"
                v-model="list[0].subElements[0].isChecked"
              />
              <span class="slider round"></span>
            </label>
          </div>
          <div>
            <p>Include Average All Others</p>
            <label class="switch" v-if="lockSections === false">
              <!-- <input type="checkbox" true-value="1" false-value="0" /> -->
              <input v-if="list.length >= 1"
              type="checkbox"
              :checked="list[0].subElements[1].isChecked"
              v-model="list[0].subElements[1].isChecked"
              />
              <span class="slider round"></span>
            </label>
          </div>
          <div>
            <p>Print PDF Button</p>
            <label class="switch" v-if="lockSections === false">
              <input v-if="list.length >= 1"
                type="checkbox"
                :checked="list[0].subElements[2].isChecked"
                v-model="list[0].subElements[2].isChecked"
              />
              <span class="slider round"></span>
            </label>
          </div>
          <div>
            <p>Expand All Button</p>
            <label class="switch" v-if="lockSections === false">
              <input v-if="list.length >= 1"
                type="checkbox"
                :checked="list[0].subElements[6].isChecked"
                v-model="list[0].subElements[6].isChecked"
              />
              <span class="slider round"></span>
            </label>
          </div>
          <div>
            <p>Histogram</p>
            <label class="switch" v-if="lockSections === false">
              <input v-if="list.length >= 1"
                type="checkbox"
                :checked="list[0].subElements[4].isChecked"
                v-model="list[0].subElements[4].isChecked"
              />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>
      <div class="body-container">
        <div class="header-button-container">
          <Header label="Section Positioning:"></Header>
          <ButtonSubmit
            id="progress-prev"
            class="btn"
            label="Lock Sections"
            v-if="lockSections === false"
            @click="populateSectionData"
          />
          <ButtonSubmit
            id="progress-prev"
            class="btn"
            label="Unlock Sections"
            v-if="lockSections === true"
            @click="unlockSections"
          />
        </div>
        <!-- {{ list }} -->
        <draggable
          :list="list"
          :disabled="!enabled"
          item-key="name"
          class="list-group"
          ghost-class="ghost"
          :move="consoleList"
          @start="dragging = true"
          @end="dragging = false"
        >
          <template #item="{ element }">
            <div class="list-group-item" :class="{ 'not-draggable': !enabled }">
              <div class="tabs">
                <div
                  class="tab"
                  v-if="
                    element.id !== 'Report Sharing Options' &&
                    element.id !== 'Header' &&
                    element.id !== 'Histogram'
                    // element.id !== 'Introduction'
                  "
                >
                  <input
                    class="accordion-input"
                    type="checkbox"
                    :id="element.id"
                  />
                  <div class="tab-lbl-container">
                    <span><i class="fa fa-align-justify handle"></i></span>
                    <label class="tab-label" :for="element.id">
                      {{ element.name }}</label
                    >
                    <input
                      v-if="lockSections === false"
                      class="tab-label-checkbox"
                      type="checkbox"
                      :checked="element.isChecked"
                      v-model="element.isChecked"
                      @change="updateSubElementsCheckbox(element)"
                    />
                  </div>


                  <div class="tab-content">
                    <div class="body-container graphing-choices">
                      <!-- jhun's codes -->
                      <!-- <div style="margin-right:10px;" v-if="lockSections === false">
                          <input
                            type="checkbox"
                            name="section2NPS"
                            id="nps"
                            :checked="element.isChecked"
                            v-model="showNPS"
                          />
                        <label for="nps">
                          <span>Show Net Promoter Score</span>
                        </label>
                      </div> -->
                      <draggable
                        :list="element.subElements"
                        :disabled="!enabled"
                        item-key="name"
                        class="list-group"
                        ghost-class="ghost"
                        :move="consoleList"
                        @start="dragging = true"
                        @end="dragging = false"
                      >
                        <template #item="{ element }">
                          <div
                            class="list-group-item"
                            :class="{ 'not-draggable': !enabled }"
                          >
                          <div style="margin-right:10px;" v-if="lockSections === false && element.subElement === 'Section2CII'">
                            <input
                              type="checkbox"
                              name="section2Chart"
                              id="cii"
                              :checked="element.isChecked"
                              v-model="element.isChecked"
                            />
                            <label for="cii">
                              <span>Show Competency Importance Index</span>
                            </label>
                          </div>
                          <div style="margin-right:10px;" v-if="lockSections === false && element.subElement === 'Section2OCS'">
                            <input
                              type="checkbox"
                              name="section2Chart"
                              id="ocs"
                              :checked="element.isChecked"
                              v-model="element.isChecked"
                            />
                            <label for="ocs">
                              <span>Show Org Climate Snapshot</span>
                            </label>
                          </div>

                          <div style="margin-right:10px;" v-if="lockSections === false && element.subElement === 'Section2NPS'">
                            <input
                              type="checkbox"
                              id="nps"
                              :checked="element.isChecked"
                              v-model="element.isChecked"
                            />
                            <label for="nps">
                              <span>Show Net Promoter Score</span>
                            </label>
                          </div>

                            <!-- <div v-for="data in element.questions" :key="data.id"> -->
                            <div>
                                <input
                              v-if="
                                lockSections === false && element.subElement == 'Confidential dynamic message.'
                              "
                              type="checkbox"
                              :checked="element.isChecked"
                              v-model="element.isChecked"
                            />
                            <input
                              v-if="
                                element.subElement == 'Confidential dynamic message.'
                              "
                              class="input"
                              value="Confidential. Being viewed by:"
                              placeholder="Confidential. Being viewed by:"
                              :disabled="lockSections === true"
                              @input="changeInputDetails($event, element.subId, element.Type)"
                            />
                              </div>


                              <div>
                                <input
                                  v-if="
                                    lockSections === false && element.subElement == 'ImportantNote'
                                  "
                                  type="checkbox"
                                  :checked="element.isChecked"
                                  v-model="element.isChecked"
                                />
                                <input
                                  v-if="
                                    element.subElement == 'ImportantNote'
                                  "
                                  :disabled="lockSections === true"
                                  class="input"
                                  value="Important note: Some of your responses have been moved into a combined group, to protect confidentiality."
                                  placeholder="Important note: Some of your responses have been moved into a combined group, to protect confidentiality."
                                  @input="changeInputImportantNote($event, element.subId, element.Type)"
                                />
                              </div>

                              <div
                              class="static-message-container">
                                <input
                                  v-if="
                                    lockSections === false && element.subElement == 'Description static message'
                                  "
                                  type="checkbox"
                                  :checked="element.isChecked"
                                  v-model="element.isChecked"
                                  id="static-message-chkbox"
                                />
                                <textarea name="" id="static-message-txt" cols="30" rows="3"
                                v-if="
                                    element.subElement == 'Description static message'
                                  "
                                  :disabled="lockSections === true"
                                  class="input"
                                  v-model="element.Text"
                                  >

                                </textarea>
                              </div>

                            <div
                              class="chart-container">
                                <input
                                  v-if="
                                    lockSections === false && element.Template.includes('Chart') 
                                    && element.subElement !== 'Section2CII' 
                                    && element.subElement !== 'Section2OCS'
                                  "
                                  
                                  type="checkbox"
                                  :checked="element.isChecked"
                                  v-model="element.isChecked"
                                />
                                <label for=""
                                v-if="element.Template.includes('Chart')
                                    && element.subElement !== 'Section2CII' 
                                    && element.subElement !== 'Section2OCS'">
                                  {{ element.name }} Chart
                                </label>
                              </div>

                              <div
                              class="table-container">
                                <input
                                  v-if="
                                    lockSections === false && element.Template.includes('Table-360')
                                    && element.subElement !== 'Section2CII' 
                                    && element.subElement !== 'Section2OCS'
                                  "
                                  
                                  type="checkbox"
                                  :checked="element.isChecked"
                                  v-model="element.isChecked"
                                />
                                <label for=""
                                v-if="
                                    element.Template.includes('Table-360')
                                    && element.subElement !== 'Section2CII' 
                                    && element.subElement !== 'Section2OCS'">
                                  {{ element.name }} Table
                                </label>
                              </div>

                          </div>
                        </template>
                      </draggable>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  component: [Header, draggable, DescriptionInline, ButtonSubmit],
  name: "ReportBuilderSetup",
  props: ["userData", "brandData", "uploadData", "sectionStatusUpdate"],
  beforeCreate() {},
  async created() {},
  beforeMount() {},
  async mounted() {
    if(this.uploadData){
      console.log('upload data ito:', this.uploadData)
      // this.list = JSON.parse(this.uploadData)
      this.list = this.uploadData;
    }

    if(this.sectionStatusUpdate){
      this.lockSections = this.sectionStatusUpdate
    }

    // console.log('upload failed :',this.uploadData);
  },
  beforeUpdate() {},
  updated() {},
  beforeUnmount() {},
  unmounted() {},
  data: () => ({
    introductionConfidentialInput: "",
    sectionName: [],
    lockSections: false,
    jsonData: null,
    isHistogramChecked : true,
    isHistogramTemplate : '',
    isCohortDataChecked : true,
    isAverageOthersChecked : true,
    isShowCIIChecked : false,
    isShowOCSChecked : false,
    isShowNPSChecked : false,
    cohortAndAverageOthersTemplate : '',
    NPSTemplateDynamic : '',
    section2CIIandOCSTemplate: '',
    NPSTemplate: '',
    list: [],
    enabled: true,
    dragging: false,
    showNPS: false,
    showCII: false,
    showOCS: false,
    selectedOption : '',
    initialReportName: ''
  }),
  computed: {
    draggingInfo() {
      // console.log(this.uploadedProp);
      return this.dragging ? "under drag" : "";
    },

    uploadedProp() {
      let newArray = JSON.parse(this.uploadData);
      //   return newArray.filter(section => section.id === 'Competencies')[0].selectedCompetencies.map(competency => {
      //   const openEndedQuestions = newArray.filter(section => section.id === 'Open-ended Questions')[0].questions;
      //   return {...competency, openEndedQuestions};
      // });
      return newArray;
    },
  },
  methods: {

    updateSubElementsCheckbox(section) {
      const sectionId = section.id;
      section.subElements.forEach((subElement) => {
        if (subElement.id === sectionId) {
          if (subElement.isChecked === true) {
            subElement.isChecked = false;
          } else {
            subElement.isChecked = true;
          }
        }
      });
      // section.graphChoices.forEach((graphChoices) => {
      //   if (graphChoices.id === sectionId) {
      //     if (graphChoices.isChecked === true) {
      //       graphChoices.isChecked = false;
      //     } else {
      //       graphChoices.isChecked = true;
      //     }
      //   }
      // });
    },

    async unlockSections() {
      Swal.fire({
        text: `Are you sure you want to Unlock sections?`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Unlock",
      }).then((result) => {
        if (result.isConfirmed) {
          this.lockSections = false;
          this.enabled = true;
          this.sectionName = [];
          this.onClickButton(this.sectionName);
        }
      });
    },
    async populateSectionData() {

      if(this.list[0].subElements[5].Text == ""){
          Swal.fire({
          text: `You forgot to fill up the report name field. Please don't leave it blank.!`,
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        })
      }else{

        // Check if report file name contains an <h2> tag
        let h2Pattern = /<h2\b[^>]*>(.*?)<\/h2>/i;
        if (!h2Pattern.test(this.list[0].subElements[5].Text)) {
          this.list[0].subElements[5].Text = "<h2>"+this.list[0].subElements[5].Text+"</h2>"
        }

        Swal.fire({
        text: `Are you sure you want to Lock sections? You can unlock it later if you still want changes.`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Lock",
      }).then((result) => {
        if (result.isConfirmed) {
          this.lockSections = true;
          this.enabled = false;

          this.sectionName = [];

        // if(this.showNPS === true){
        //   console.log('WITH NPS')
        //   if (this.showCII === true && this.showOCS === false) {
        //     this.section2CIIandOCSTemplate = 'Bar-Chart-New-360-Head-CII'
        //     console.log('showCII only');
        //   } else if (this.showCII === false && this.showOCS === true) {
        //     this.section2CIIandOCSTemplate = 'Bar-Chart-New-360-Head-OCS'
        //     console.log('showOCS only');
        //   } else if (this.showCII === true && this.showOCS === true) {
        //     this.section2CIIandOCSTemplate = 'Bar-Chart-New-360-Head'
        //     console.log('showCII and showOCS');
        //   } else {
        //     this.section2CIIandOCSTemplate = 'Bar-Chart-New-360-Head-Without-CII-And-OCS'
        //     console.log('None are true, don\'t show CII and OCS');
        //   }
        // } else {
        //   console.log('NO NPS')
        //   if (this.showCII === true && this.showOCS === false) {
        //     this.section2CIIandOCSTemplate = 'Bar-Chart-New-360-Head-CII-NO-NPS'
        //     console.log('showCII only');
        //   } else if (this.showCII === false && this.showOCS === true) {
        //     this.section2CIIandOCSTemplate = 'Bar-Chart-New-360-Head-OCS-NO-NPS'
        //     console.log('showOCS only');
        //   } else if (this.showCII === true && this.showOCS === true) {
        //     this.section2CIIandOCSTemplate = 'Bar-Chart-New-360-Head-NO-NPS'
        //     console.log('showCII and showOCS');
        //   } else {
        //     this.section2CIIandOCSTemplate = 'Bar-Chart-New-360-Head-Without-CII-And-OCS-NO-NPS'
        //     console.log('None are true, don\'t show CII and OCS');
        //   }
        // }
          

          this.list.forEach((element) => {

            if (element.isChecked === true) {
              // if cohort data is off
              // const cohortData = this.cohortData == "true" ? element.Template : "Bar-Chart-New-360-Sub-With-Others-And-No-Cohort"
              const sectionData = {
                Type: element.Type,
                QuestionNumber: element.QuestionNumber,
                Text: element.Text,
                Template: element.Template,
              };

              this.sectionName.push(sectionData);

              element.subElements.forEach((subElement) => {
                // check if cohort data is on or off
                if(subElement.Template == 'Cohort-Data') {
                  this.isCohortDataChecked = subElement.isChecked
                }
                
                // check if average others is on or off
                if(subElement.Template == 'Average-Others') {
                  this.isAverageOthersChecked = subElement.isChecked

                  if(this.isCohortDataChecked && this.isAverageOthersChecked) {
                    // console.log('both true');
                    this.cohortAndAverageOthersTemplate = 'Bar-Chart-New-360-Sub'
                  }
                  else if(!this.isCohortDataChecked && !this.isAverageOthersChecked) {
                    // console.log('both false');
                    this.cohortAndAverageOthersTemplate = 'Bar-Chart-New-360-Sub-Without-Cohort-And-Others'
                  }
                  else if(this.isCohortDataChecked && !this.isAverageOthersChecked) {
                    // console.log('cohort true and average others false');
                    this.cohortAndAverageOthersTemplate = 'Bar-Chart-New-360-Sub-With-Cohort-And-No-Others'
                  }
                  else if(!this.isCohortDataChecked && this.isAverageOthersChecked) {
                    // console.log('cohort false and average others true');
                    this.cohortAndAverageOthersTemplate = 'Bar-Chart-New-360-Sub-With-Others-And-No-Cohort'
                  }
                }


                if(subElement.Template == 'Average-Others') {
                  this.isAverageOthersChecked = subElement.isChecked

                  if(this.isCohortDataChecked && this.isAverageOthersChecked) {
                    // console.log('both true');
                    this.NPSTemplateDynamic = 'Bar-Chart-New-360-Sub-NPS'
                  }
                  else if(!this.isCohortDataChecked && !this.isAverageOthersChecked) {
                    // console.log('both false');
                    this.NPSTemplateDynamic = 'Bar-Chart-New-360-Sub-Without-Cohort-And-Others-NPS'
                  }
                  else if(this.isCohortDataChecked && !this.isAverageOthersChecked) {
                    // console.log('cohort true and average others false');
                    this.NPSTemplateDynamic = 'Bar-Chart-New-360-Sub-With-Cohort-And-No-Others-NPS'
                  }
                  else if(!this.isCohortDataChecked && this.isAverageOthersChecked) {
                    // console.log('cohort false and average others true');
                    this.NPSTemplateDynamic = 'Bar-Chart-New-360-Sub-With-Others-And-No-Cohort-NPS'
                  }
                }


                // check if section 2 ShowCII checked or uncheck
                if(subElement.subElementName == 'showCII') {
                  this.isShowCIIChecked = subElement.isChecked
                }

                // check if section 2 ShowOCS is checked or uncheck
                if(subElement.subElementName == 'showOCS') {
                  this.isShowOCSChecked = subElement.isChecked

                  if (this.isShowCIIChecked === true && this.isShowOCSChecked === false) {
                    this.section2CIIandOCSTemplate = 'Bar-Chart-New-360-Head-CII'
                    console.log('showCII only');
                  } else if (this.isShowCIIChecked === false && this.isShowOCSChecked === true) {
                    this.section2CIIandOCSTemplate = 'Bar-Chart-New-360-Head-OCS'
                    console.log('showOCS only');
                  } else if (this.isShowCIIChecked === true && this.isShowOCSChecked === true) {
                    this.section2CIIandOCSTemplate = 'Bar-Chart-New-360-Head'
                    console.log('showCII and showOCS');
                  } else {
                    this.section2CIIandOCSTemplate = 'Bar-Chart-New-360-Head-Without-CII-And-OCS'
                    console.log('None are true, don\'t show CII and OCS');
                  }
                }


                // check if section 2 Show NPS checked or uncheck
                if(subElement.subElementName == 'showNPS') {
                  this.isShowNPSChecked = subElement.isChecked
                  console.log("subElement.subElementName == showNPS");
                  console.log(this.isShowNPSChecked);

                  this.NPSTemplate = this.isShowNPSChecked ? 'With-NPS' : 'Without-NPS'

                  const subElementData = {
                    Type: "",
                    QuestionNumber: "",
                    Text: "",
                    Template: this.NPSTemplate,
                  };

                  this.sectionName.push(subElementData);
                }

                //other template important
                if (subElement.isChecked === true) {
                  if(subElement.id == "ImportantTemplate") {
                    const subElementData = {
                      Type: subElement.Type,
                      QuestionNumber: subElement.QuestionNumber,
                      Text: subElement.Text,
                      Template: subElement.Template,
                    };

                    this.sectionName.push(subElementData);
                  }
                }

                if (subElement.isChecked === true) {
                  if(subElement.id == "Introduction") {
                    const subElementData = {
                      Type: subElement.Type,
                      QuestionNumber: subElement.QuestionNumber,
                      Text: subElement.Text,
                      Template: subElement.Template,
                    };

                    this.sectionName.push(subElementData);
                  }
                }

                // section 2
                if(subElement.id == "High-level-competency-scores") {
                  const subElementData = {
                    Type: subElement.Type,
                    QuestionNumber: subElement.QuestionNumber,
                    Text: subElement.Text,
                    Template: this.section2CIIandOCSTemplate,
                  };

                  this.sectionName.push(subElementData);
                }

                // section 3-8
                if (subElement.isChecked === true) {
                  if(subElement.id == "Competencies") {
                    const subElementData = {
                      Type: subElement.Type,
                      QuestionNumber: subElement.QuestionNumber,
                      Text: subElement.Text,
                      Template: this.cohortAndAverageOthersTemplate,
                    };

                    this.sectionName.push(subElementData);
                  }
                }

                if (subElement.isChecked === true) {
                  if(subElement.id == "Net-Promoter-Score") {
                    const subElementData = {
                      Type: subElement.Type,
                      QuestionNumber: subElement.QuestionNumber,
                      Text: subElement.Text,
                      Template: this.NPSTemplateDynamic,
                    };

                    this.sectionName.push(subElementData);
                  }
                }
                
                //check if histogram is on or off
                if(subElement.Template == 'Histogram') {
                  this.isHistogramChecked = subElement.isChecked

                  this.isHistogramTemplate = this.isHistogramChecked ? 'Add-Histogram' : 'Without-Histogram'
                }

                //Histogram
                if (subElement.isChecked === true) {
                  if(subElement.id == "Add-Histogram") {
                    const subElementData = {
                      Type: subElement.Type,
                      QuestionNumber: subElement.QuestionNumber,
                      Text: subElement.Text,
                      Template: this.isHistogramTemplate,
                    };

                    this.sectionName.push(subElementData);
                  }
                }

                // section organization climate
                if (subElement.isChecked === true) {
                  if(subElement.id == "Radar-Chart-Self") {
                    const subElementData = {
                      Type: subElement.Type,
                      QuestionNumber: subElement.QuestionNumber,
                      Text: subElement.Text,
                      Template: subElement.Template,
                    };

                    this.sectionName.push(subElementData);
                  }

                  if(subElement.id == "Radar-Chart-Cohort") {
                    const subElementData = {
                      Type: subElement.Type,
                      QuestionNumber: subElement.QuestionNumber,
                      Text: subElement.Text,
                      Template: subElement.Template,
                    };

                    this.sectionName.push(subElementData);
                  }
                }

                // section competency importance index 
                if (subElement.isChecked === true) {
                  if(subElement.id == "Competency-Importance-Index") {
                    const subElementData = {
                      Type: subElement.Type,
                      QuestionNumber: subElement.QuestionNumber,
                      Text: subElement.Text,
                      Template: subElement.Template,
                    };

                    this.sectionName.push(subElementData);
                  }
                }

                // section highest lowest
                if (subElement.isChecked === true) {
                  if(subElement.id == "Bar-Chart-360-Highest") {
                    const subElementData = {
                      Type: subElement.Type,
                      QuestionNumber: subElement.QuestionNumber,
                      Text: subElement.Text,
                      Template: subElement.Template,
                    };

                    this.sectionName.push(subElementData);
                  }

                  if(subElement.id == "Bar-Chart-360-Lowest") {
                    const subElementData = {
                      Type: subElement.Type,
                      QuestionNumber: subElement.QuestionNumber,
                      Text: subElement.Text,
                      Template: subElement.Template,
                    };

                    this.sectionName.push(subElementData);
                  }

                  // if cohort is on and the cohort should be hidden
                  if(!this.isCohortDataChecked) {
                    if(subElement.id == "Bar-Chart-360-Highest") {
                      const subElementData = {
                        Type: "",
                        QuestionNumber: "",
                        Text: "",
                        Template: "Bar-Chart-360-Highest-Lowest-NoCohort",
                      };

                      this.sectionName.push(subElementData);
                    }
                  }
                }

                // section blind spot
                if (subElement.isChecked === true) {
                  if(subElement.id == "Blind-Spot-Overestimated") {
                    const subElementData = {
                      Type: subElement.Type,
                      QuestionNumber: subElement.QuestionNumber,
                      Text: subElement.Text,
                      Template: subElement.Template,
                    };

                    this.sectionName.push(subElementData);
                  }

                  if(subElement.id == "Blind-Spot-Underestimated") {
                    const subElementData = {
                      Type: subElement.Type,
                      QuestionNumber: subElement.QuestionNumber,
                      Text: subElement.Text,
                      Template: subElement.Template,
                    };

                    this.sectionName.push(subElementData);
                  }
                }

                // section open ended question
                if (subElement.isChecked === true) {
                  if(subElement.id == "Open-Ended-Questions") {
                    const subElementData = {
                      Type: subElement.Type,
                      QuestionNumber: subElement.QuestionNumber,
                      Text: subElement.Text,
                      Template: subElement.Template,
                    };

                    this.sectionName.push(subElementData);
                  }
                }

                if (subElement.isChecked === true) {
                  if(subElement.id == "Appendix") {
                    const subElementData = {
                      Type: subElement.Type,
                      QuestionNumber: subElement.QuestionNumber,
                      Text: subElement.Text,
                      Template: subElement.Template,
                    };

                    this.sectionName.push(subElementData);
                  }
                }
              

              });
            }
          });

          // console.log('sectionName');
          // console.log(this.sectionName);
          
        this.sectionName = this.updateQuestionNumbers(this.sectionName);
        }

        // console.log(this.sectionName)
      });
      }

    },
    async updateQuestionNumbers(data) {
      console.log(data)
        const sectionObjects = data.filter(
          obj => obj.Template == "Section");

        console.log(sectionObjects)

        for (let i = 0; i < sectionObjects.length; i++) {
          sectionObjects[i].QuestionNumber = (i + 1).toString();
        }

        this.onClickButton(this.sectionName);
    },

    consoleList() {
      // console.log(this.list);
      // console.log(this.sectionName);
    },

    async onClickButton(sectionName) {
      console.log(sectionName)
      // console.log('this is section name')
        this.$emit("clicked", ({
          sectionsGenerated: sectionName, 
          rawJson: this.list, 
          lockSections: this.lockSections, 
          reportName: this.list[0].subElements[5].Text
          // reportName: "<h2>" +this.list[0].subElements[5].Text+ "</h2>"
        }));
    },

    checkMove: function (e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
    },

    changeInputDetails(event, elementSubId, elementType){
      this.list.map((element)=>{
          element.subElements.map((subElement)=>{
            if(subElement.Type == elementType && subElement.subId == elementSubId){
              subElement.Text = `<p><strong>${event.target.value}&output_name</strong></p>`
            }
          })
      })
      console.log(this.list)
    },

    changeInputImportantNote(event, elementSubId, elementType){
      this.list.map((element)=>{
          element.subElements.map((subElement)=>{
            if(subElement.Type == elementType && subElement.subId == elementSubId){
              subElement.Text = `<p><strong>${event.target.value}</strong></p>`
            }
          })
      })
      console.log(this.list)
    },
  },
};
</script>


<style scoped>
.body-container {
  padding: 20px;
  /* box-shadow: none; */
  min-width: 75vw;
}

.header-button-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.btn {
  margin: 10px 0 10px 0;
}

.graphing-choices {
  /* padding: 10px; */
  margin: 10px;
}

.input {
  min-width: 90%;
  outline: 0;
  border-width: 0 0 1px;
  border-color: grey;
  padding: 2px 5px;
  margin: 10px 0px;
  font-family: Arial, Helvetica, sans-serif;
}

.static-message-container{
  position: relative;
}

#static-message-chkbox{
  position: absolute;
}

#static-message-txt{
  margin: 0 20px;
}

.report-name-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.description {
  font-size: 1.5vw;
}
.report-name-input {
  width: 100%;
  font-size: 1.5vw;
}

.graphing-choices .display {
  padding: 10px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.display {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.header {
  font-size: 17px;
}
.graphing-choices .header {
  font-size: 14px;
}
.buttons {
  margin-top: 35px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.not-draggable {
  cursor: no-drop;
}

/* CSS draggable */
.accordion-input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}
/* Accordion styles */
.tabs {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 2px 10px -4px #000000;
  margin: 10px 0px;
}
.tab {
  min-width: 75vw;
  width: 100%;
  color: white;
  overflow: hidden;
  background: #f7f7f7;
}
.tab-lbl-container {
  position: relative;
  padding: 0 0 0 10px;
}

.tab-label-checkbox {
  cursor: pointer;
  position: absolute;
  top: 32%;
  /* right: 50%; */
  right: 95%;
  z-index: 99;
}
.tab-label {
  display: flex;
  justify-content: space-between;
  padding: 1em 1em 1em 3em;
  font-weight: bold;
  cursor: pointer;
  margin: 0px;
  font-size: 20px;
  color: #000000;
  /* Icon */
}
.tab-label::after {
  content: "\276F";
  width: 1em;
  height: 1em;
  text-align: center;
  transition: ease-in-out 0.65s;
  transform: rotate(-90deg);
}
.tab-content {
  max-height: 0;
  padding: 0 1em;
  color: #2c3e50;
  background: white;
  transition: ease-in-out 0.65s;
}
.list-group-item label {
  font-size: 14px;
}
.tab:hover {
  background: #c4c8cb;
}
.accordion-input:checked + .tab-lbl-container {
  background: #c4c8cb;
}
.accordion-input:checked + .tab-lbl-container .tab-label::after {
  transform: rotate(90deg);
}
.accordion-input:checked ~ .tab-content {
  max-height: 100vh;
  padding: 1em;
}

.handle {
  cursor: pointer;
  float: left;
  padding: 15px 0 0 0;
  color: rgb(251, 123, 3);
}

/* CSS draggable end */

/* Display switches css start*/

.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 17px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(59, 59, 59);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 13px;
  width: 13px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(13px);
  -ms-transform: translateX(13px);
  transform: translateX(13px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Display switches css end */

/* Open ended question css start */
.oeq-label {
  min-width: 70vw;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0px 2px 10px -4px #000000;
  margin: 10px 10px 0 0;
  padding: 15px 0 0 5px;
  height: 40px;
  background: #c4c8cb;
  /* text-align: center; */
}

.oeq-label:hover {
  background: #acaeb1;
  /* text-align: center; */
}
/* open ended question css end */

@media only screen and (min-width: 280px) and (max-width: 700px) {
  .tab-label-checkbox {
    position: absolute;
    top: 32%;
    /* right: 50%; */
    right: 92%;
    z-index: 99;
  }
}

@media only screen and (min-width: 700px) and (max-width: 900px) {
  .tab-label-checkbox {
    /* right: 50%; */
    right: 93%;
  }
}

@media only screen and (min-width: 900px) and (max-width: 1200px) {
  .tab-label-checkbox {
    /* right: 50%; */
    right: 94%;
  }
}

@media only screen and (min-width: 1200px) and (max-width: 1500px) {
  .tab-label-checkbox {
    /* right: 50%; */
    right: 95%;
  }
}

@media only screen and (min-width: 1500px) and (max-width: 2000px) {
  .tab-label-checkbox {
    /* right: 50%; */
    right: 96%;
  }
}

@media only screen and (min-width: 2000px) and (max-width: 2400px) {
  .tab-label-checkbox {
    /* right: 50%; */
    right: 97%;
  }
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>