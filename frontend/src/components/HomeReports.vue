<script setup>
import ButtonSubmit from "./ButtonSubmit.vue";
import api from "../api/api";
// import axios from 'axios'
import Swal from 'sweetalert2'
</script>

<template>
  <div class="main-div">
    <div
      class="bg-main-color1"
      style="
        padding: 10px;
        color: #fff;
        display: flex;
        justify-content: space-between;
      "
    >
      <div>
        <strong>{{ label }}</strong>
      </div>
      <button
        class="bg-main-color1"
        style="color: #fff"
        @click.prevent="toggle = !toggle"
        v-show="!toggle"
      >
        Show
      </button>
      <button
        class="bg-main-color1"
        style="color: #fff"
        @click.prevent="toggle = !toggle"
        v-show="toggle"
      >
        Hide
      </button>
    </div>
    <div
      class="parent"
      v-show="toggle"
      v-if="
        surveyReport.length == 0 &&
        tippingPointReport.length == 0 &&
        pressurePointReport.length == 0
      "
    >
      <h2>No report(s) available.</h2>
    </div>

    <div class="parent" v-show="toggle" v-if="surveyReport.length > 0">
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in surveyReport"
        :key="report"
      >
        <div>
          <p>{{ report.program_name }}</p>
          <div v-if="report.stream_name != null && report.group_name == null">
            <p>{{ report.stream_name }}</p>
          </div>
          <div
            v-else-if="report.stream_name == null && report.group_name != null"
          >
            <p>{{ report.group_name }}</p>
          </div>
          <div
            v-else-if="report.stream_name == null && report.group_name == null"
          >
            <p></p>
          </div>
          <div
            v-else-if="report.stream_name != null && report.group_name != null"
          >
            <p>{{ report.stream_name }}/{{ report.group_name }}</p>
          </div>
          <h2>{{ report.iteration_name }}</h2>
          <h2>{{ report.report_template_name }}</h2>
          <h3>For: {{ report.full_name }}</h3>
        </div>
        <div v-if="report.survey_type == 1">
          <img
            class="surveyLogo"
            src="../../public/survey_logo/big5_survey_logo.png"
          />
        </div>
        <div v-if="report.survey_type == 2">
          <img
            class="surveyLogo"
            src="../../public/survey_logo/360_survey_logo.png"
          />
        </div>
        <div v-if="report.survey_type == 3">
          <img
            class="surveyLogo"
            src="../../public/survey_logo/research_survey_logo.png"
          />
        </div>
        <div
          v-if="
            report.survey_type == 4 &&
            report.report_file == 'QSort-BEP-Report.html'
          "
        >
          <img
            class="surveyLogo"
            src="../../public/survey_logo/qSort_BEP.png"
          />
        </div>
        <div
          v-if="
            report.survey_type == 4 &&
            report.report_file == 'QSort-GDP-Report.html'
          "
        >
          <img
            class="surveyLogo"
            src="../../public/survey_logo/qSort_GDP.png"
          />
        </div>
        <div
          v-if="
            report.survey_type == 4 &&
            report.report_file == 'QSort-OCM-Report.html'
          "
        >
          <img
            class="surveyLogo"
            src="../../public/survey_logo/qSort_OCM.png"
          />
        </div>
        <div
          v-if="
            report.survey_type == 4 &&
            report.report_file == 'QSort-BEP-Cohort-Report.html'
          "
        >
          <img
            class="surveyLogo"
            src="../../public/survey_logo/qSort_BEP.png"
          />
        </div>
        <div
          v-if="
            report.survey_type == 4 &&
            report.report_file == 'QSort-GDP-Cohort-Report.html'
          "
        >
          <img
            class="surveyLogo"
            src="../../public/survey_logo/qSort_GDP.png"
          />
        </div>
        <div
          v-if="
            report.survey_type == 4 &&
            report.report_file == 'QSort-OCM-Cohort-Report.html'
          "
        >
          <img
            class="surveyLogo"
            src="../../public/survey_logo/qSort_OCM.png"
          />
        </div>
        <div v-if="report.survey_type == 5">
          <img
            class="surveyLogo"
            src="../../public/survey_logo/VFP_logo.png"
          />
        </div>
        <!-- <a href="#">View Sample Report</a> -->

        <div>
          <p v-if="report.coach_access_granted == 1">Share status: Yes</p>
          <p v-if="report.coach_access_granted == 0">Share status: No</p>
          <label class="switch">
            <input
              type="checkbox"
              v-model="report.coach_access_granted"
              true-value="1"
              false-value="0"
              @change="
                coachPermission(
                  report.survey_assignment_id,
                  report.coach_access_granted
                )
              "
            />
            <span class="slider round"></span>
          </label>
        </div>

        <!--360 eligibility-->
        <div
          class="tooltip"
          v-if="
            report.dropped_status == 0 &&
            report.not_eligible == 1 &&
            report.report_file.includes('360')
          "
        >
          Are you eligible for a report?
          <span class="tooltiptext"
            >- You must have 2 respondents <br /><br />
            - You must have a self assessment</span
          >
        </div>

        <ButtonSubmit
          v-if="
            report.dropped_status == 0 &&
            report.not_eligible == 1 &&
            report.report_file.includes('360')
          "
          disabled
          label="Not eligible for a report"
          style="margin-top: 10px"
        />

        <!-- 360 buttons -->
        <a
        style="margin: 10px 0 10px 0"
          v-if="report.is_pdf_available === 1"
          class="btn-submit"
          @click="showReportPdf(report.report_template_id, report.survey_assignment_id)"
          >View Report PDF</a
        >

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            report.not_eligible == 0 &&
            report.report_file.includes('360')
          "
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&is_pdf_available=${report.is_pdf_available}&rand=${rand}`"
          target="_blank"
          >View Individual Report</a
        >


        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            report.report_file.includes('5Step')
          "
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&is_pdf_available=${report.is_pdf_available}&rand=${rand}`"
          target="_blank"
          >View Individual Report</a
        >

        <!--VFP report-->
        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 && report.report_file.includes('VFP')
          "
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_name=${report.org_name}&org_id=${report.org_id}&subOrg_id=${
            report.suborg_id
          }&program_id=${report.program_id}&iteration_id=${
            report.iteration_id
          }&is_pdf_available=${report.is_pdf_available}`"
          target="_blank"
          >View Individual Report</a
        >

        <!--q-sort-->
        <!--BEP-->

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            report.report_file.includes('QSort-BEP')
          "
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&rand=${rand}&qsort_type=${qsortBEP}&is_pdf_available=${report.is_pdf_available}`"
          target="_blank"
          >View Individual Report</a
        >

        <!--OCM-->

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            report.report_file.includes('QSort-OCM')
          "
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&rand=${rand}&qsort_type=${qsortOCM}&is_pdf_available=${report.is_pdf_available}`"
          target="_blank"
          >View Individual Report</a
        >

        <!--GDP-->
        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            report.report_file.includes('QSort-GDP')
          "
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&rand=${rand}&qsort_type=${qsortGDP}&is_pdf_available=${report.is_pdf_available}`"
          target="_blank"
          >View Individual Report</a
        >

        <!-- global button -->

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            !report.report_file.includes('5Step') &&
            !report.report_file.includes('360') &&
            !report.report_file.includes('QSort-GDP') &&
            !report.report_file.includes('QSort-OCM') &&
            !report.report_file.includes('QSort-BEP') && 
            !report.report_file.includes('VFP')
          "
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&is_pdf_available=${report.is_pdf_available}&rand=${rand}`"
          target="_blank"
          >View Individual Report</a
        >

        <ButtonSubmit
          v-if="
            report.dropped_status == 1
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />

        <!--Admin button-->

        <div class="tooltip" v-if="userId" style="margin-top: 10px">
          Information
          <span class="tooltiptext"
            >- Above this tooltip shows exactly what the participant see in
            their report tile screen.
            <br />
            <br />- This tooltip and the button under this only shows for Admin
            to view the report.</span
          >
        </div>

        <a
          class="btn-submit"
          v-if="userId"
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <!--tipping point report-->
    <div class="parent" v-show="toggle" v-if="tippingPointReport.length > 0">
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in tippingPointReport"
        :key="report"
      >
        <div>
          <p>{{ report.program_name }}</p>
          <div v-if="report.stream_name != null && report.group_name == null">
            <p>{{ report.stream_name }}</p>
          </div>
          <div
            v-else-if="report.stream_name == null && report.group_name != null"
          >
            <p>{{ report.group_name }}</p>
          </div>
          <div
            v-else-if="report.stream_name == null && report.group_name == null"
          >
            <p></p>
          </div>
          <div
            v-else-if="report.stream_name != null && report.group_name != null"
          >
            <p>{{ report.stream_name }}/{{ report.group_name }}</p>
          </div>
          <h2>{{ report.iteration_name }}</h2>
          <h2>{{ report.report_template_name }}</h2>
          <h3>For: {{ report.full_name }}</h3>
        </div>
        <div>
          <img
            class="surveyLogo"
            src="../../public/survey_logo/tipping_point_logo.png"
          />
        </div>
        <!-- <a href="#">View Sample Report</a> -->

        <div>
          <p v-if="report.coach_access_granted == 1">Share status: Yes</p>
          <p v-if="report.coach_access_granted == 0">Share status: No</p>
          <label class="switch">
            <input
              type="checkbox"
              v-model="report.coach_access_granted"
              true-value="1"
              false-value="0"
              @change="
                coachPermission(
                  report.survey_assignment_id,
                  report.coach_access_granted
                )
              "
            />
            <span class="slider round"></span>
          </label>
        </div>

        <a
        style="margin: 10px 0 10px 0"
          v-if="report.is_pdf_available === 1"
          class="btn-submit"
          @click="showReportPdf(report.report_template_id, report.survey_assignment_id)"
          >View Report PDF</a
        >


        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 
          "
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&is_pdf_available=${report.is_pdf_available}&rand=${rand}`"
          target="_blank"
          >View Individual Report</a
        >
        <ButtonSubmit
          v-if="
            report.dropped_status == 1 
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />
        <div class="tooltip" v-if="userId" style="margin-top: 10px">
          Information
          <span class="tooltiptext"
            >- Above this tooltip shows exactly what the participant see in
            their report tile screen.
            <br />
            <br />- This tooltip and the button under this only shows for Admin
            to view the report.</span
          >
        </div>
        <a
          class="btn-submit"
          v-if="userId"
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <!--pressure point report-->
    <div class="parent" v-show="toggle" v-if="pressurePointReport.length > 0">
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in pressurePointReport"
        :key="report"
      >
        <div>
          <p>{{ report.program_name }}</p>
          <div v-if="report.stream_name != null && report.group_name == null">
            <p>{{ report.stream_name }}</p>
          </div>
          <div
            v-else-if="report.stream_name == null && report.group_name != null"
          >
            <p>{{ report.group_name }}</p>
          </div>
          <div
            v-else-if="report.stream_name == null && report.group_name == null"
          >
            <p></p>
          </div>
          <div
            v-else-if="report.stream_name != null && report.group_name != null"
          >
            <p>{{ report.stream_name }}/{{ report.group_name }}</p>
          </div>
          <h2>{{ report.iteration_name }}</h2>
          <h2>{{ report.report_template_name }}</h2>
          <h3>For: {{ report.full_name }}</h3>
        </div>
        <div>
          <img
            class="surveyLogo"
            src="../../public/survey_logo/pressure_point_logo.png"
          />
        </div>
        <!-- <a href="#">View Sample Report</a> -->
        
        <div>
          <p v-if="report.coach_access_granted == 1">Share status: Yes</p>
          <p v-if="report.coach_access_granted == 0">Share status: No</p>
          <label class="switch">
            <input
              type="checkbox"
              v-model="report.coach_access_granted"
              true-value="1"
              false-value="0"
              @change="
                coachPermission(
                  report.survey_assignment_id,
                  report.coach_access_granted
                )
              "
            />
            <span class="slider round"></span>
          </label>
        </div>


        <a 
          style="margin: 10px 0 10px 0"
          v-if="report.is_pdf_available === 1"
          class="btn-submit"
          @click="showReportPdf(report.report_template_id, report.survey_assignment_id)"
          >View Report PDF</a
        >


        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 
          "
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&is_pdf_available=${report.is_pdf_available}&rand=${rand}`"
          target="_blank"
          >View Individual Report</a
        >
        <ButtonSubmit
          v-if="
            report.dropped_status == 1 
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />
        <div class="tooltip" v-if="userId" style="margin-top: 10px">
          Information
          <span class="tooltiptext"
            >- Above this tooltip shows exactly what the participant see in
            their report tile screen.
            <br />
            <br />- This tooltip and the button under this only shows for Admin
            to view the report.</span
          >
        </div>
        <a
          class="btn-submit"
          v-if="userId"
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: [ButtonSubmit],
  name: "HomeReports",
  data: () => ({
    toggle: true,
    reportData: [],
    rand: "",
    coachAccess: "",
    reportId: "",
    qsortBEP: "BEP",
    qsortGDP: "GDP",
    qsortOCM: "OCM",
    setLoading: false
  }),
  props: {
    userData: Object,
    brandData: Object,
    reportName: String,
    surveyName: String,
    dateTime: String,
    buttonLabel: String,
    label: String,
    buttonColor: String,
    userId: Number,
    country: String,
    sex: String,
  },
  async mounted() {
    this.rand = Math.random()
    if (this.userId) {
      this.reportId = this.userId;

      await api
        .get(`get-participant-reports-by-admin/${this.reportId}`)
        .then((res) => {
          this.reportData = res.data;
        console.log(res.data);
          if (this.reportData.length > 0) {
            for (var i = 0; i < this.reportData.length; i++) {
              api
                .get(
                  `get-not-eligible360/${this.reportData[i].survey_assignment_id}`
                )
                .then((res) => {
                  let checkEligibility = [];
                  checkEligibility.push(res.data)
                  this.reportData.forEach((reportItem) => {
                  // console.log(reportItem)
                  // console.log(checkEligibility)
                  const existData = checkEligibility.find(
                      (resItem) =>
                        resItem.survey_assignment_id ===
                        reportItem.survey_assignment_id
                    );
                    if (existData) {
                      reportItem.not_eligible = existData.not_eligible;
                    }
                  });
                });
              api
                .get(
                  `survey-results-sex-country/${this.reportData[i].survey_assignment_id}`
                )
                .then((res) => {
                  this.reportData.forEach((reportItem) => {
                    // console.log(reportItem)
                    const existData = res.data.find(
                      (resItem) =>
                        resItem.survey_assignment_id ===
                        reportItem.survey_assignment_id
                    );
                    if (existData) {
                      reportItem.gender = existData.gender;
                      reportItem.country = existData.country;
                    }
                  });
                });
            }
          }
        });
    } else {
      this.reportId = this.userData.ind_id;

      await api.get(`get-participant-reports/${this.reportId}`).then((res) => {
        this.reportData = res.data;
        console.log(res.data);
        if (this.reportData.length > 0) {
          for (var i = 0; i < this.reportData.length; i++) {
            api
              .get(
                `get-not-eligible360/${this.reportData[i].survey_assignment_id}`
              )
              .then((res) => {
                // console.log(res.data)
                let checkEligibility = [];
                checkEligibility.push(res.data)
                this.reportData.forEach((reportItem) => {
                  // console.log(reportItem)
                  // console.log(checkEligibility)
                  const existData = checkEligibility.find(
                    (resItem) =>
                      resItem.survey_assignment_id ===
                      reportItem.survey_assignment_id
                  );
                  if (existData) {
                    reportItem.not_eligible = existData.not_eligible;
                  }
                });
              });
            api
              .get(
                `survey-results-sex-country/${this.reportData[i].survey_assignment_id}`
              )
              .then((res) => {
                this.reportData.forEach((reportItem) => {
                  // console.log(reportItem)
                  const existData = res.data.find(
                    (resItem) =>
                      resItem.survey_assignment_id ===
                      reportItem.survey_assignment_id
                  );
                  if (existData) {
                    reportItem.gender = existData.gender;
                    reportItem.country = existData.country;
                  }
                });
              });
          }
        }
        // console.log(this.reportData);
      });
    }
  },

  methods: {
    myReport(
      report_file,
      survey_assignment_id,
      report_full_name,
      report_program_id,
      report_iteration_id,
      report_org_id,
      report_suborg_id
    ) {
      // get sex and country first
      api
        .get(`survey-results-sex-country/${survey_assignment_id}`)
        .then((res) => {
          let data;
          if (res.data.length > 0) {
            data = {
              survey_assignment_id: survey_assignment_id,
              report_link: this.brandData.website_url + report_file,
              viewer_fullname:
                this.userData.first_name + " " + this.userData.last_name, //login user
              country: res.data[0].answer,
              sex: res.data[1].answer,
              report_for_fullname: report_full_name,
              org_id: report_org_id,
              suborg_id: report_suborg_id,
              program_id: report_program_id,
              iteration_id: report_iteration_id,
            };
          } else {
            data = {
              survey_assignment_id: survey_assignment_id,
              report_link: this.brandData.website_url + report_file,
              viewer_fullname:
                this.userData.first_name + " " + this.userData.last_name, //login user
              report_for_fullname: report_full_name,
              org_id: report_org_id,
              suborg_id: report_suborg_id,
              program_id: report_program_id,
              iteration_id: report_iteration_id,
            };
          }

          this.$router.push({
            name: "MyReport",
            params: { data: JSON.stringify(data) },
          });
        });
    },

    async coachPermission(survey_assignment_id, coach_access_granted) {
      await api.put(
        `survey-assignment/coach-access-granted/${survey_assignment_id}`,
        {
          coach_access_granted: coach_access_granted,
        }
      );
      // .then((res) => {
      //   console.log(res);
      // });
    },
    async showReportPdf(reportTemplateId, surveyAssignmentId){
      this.setLoading = true
      let url = null
      if(this.setLoading === true){
        this.showPdfAlert()
      }
        try {
          const requestBody = {
            report_template_id: reportTemplateId,
            survey_assignment_id: surveyAssignmentId,
          };

            const response = await api.post('/get-pdf-content', requestBody, {
            responseType: 'blob', // Specify the response type as blob
          });
  
          // Create a blob URL from the response data
          const blob = new Blob([response.data], { type: 'application/pdf' });
          url = window.URL.createObjectURL(blob);

          if(url !== null){
            window.open(url, '_blank');
            this.setLoading = false
            if(this.setLoading === false){
              this.hidePdfAlert()
              console.log("URL ", url)
            }
          }
          // Open the PDF in a new tab
          
        } catch (error) {
          console.error('Error downloading PDF:', error);
          // Handle errors here
        }
    },

    async showPdfAlert(){
      Swal.fire({
        title: "Preparing your pdf, please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    },

    async hidePdfAlert(){
      Swal.close()
    }

  },

  computed: {
    surveyReport: function () {
      return this.reportData.filter(function (el) {
        return (
          !el.report_file.includes('TIPping') &&
          !el.report_file.includes('Pressure')
        );
      }, this);
    },

    tippingPointReport: function () {
      return this.reportData.filter(function (el) {
        return el.tag_type == "has_tipping_point";
      }, this);
    },

    pressurePointReport: function () {
      return this.reportData.filter(function (el) {
        return el.tag_type == "has_pressure_point";
      }, this);
    },
  },
};
</script>

<style scoped>
.main-div {
  min-width: 75vw;
  margin: 15px;
}
.parent {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}
.child {
  border: 1px solid #888;
  border-radius: 10px;
  border-top: 6px solid #0e5071;
  text-align: center;
  font: -webkit-control;
  min-width: 205px;
  max-width: 205px;
  margin: 0 10px;
  padding: 10px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 4px #ccc;
}
.child:hover {
  border-radius: 2px;
  box-shadow: 5px 8px #ccc;
  transition: all 300ms ease;
}
.child-submitted {
  border: 1px solid #888;
  border-radius: 10px;
  border-top: 6px solid #54575b;
  text-align: center;
  font: -webkit-control;
  min-width: 205px;
  max-width: 205px;
  margin: 0 10px;
  padding: 10px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 4px #ccc;
}
.child-submitted:hover {
  border-radius: 2px;
  box-shadow: 5px 8px #ccc;
  transition: all 300ms ease;
}
.btn-submit {
  text-decoration: none;
}
.surveyLogo {
  width: 150px;
  height: auto;
}

.tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
  color: #888;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 150px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
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
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
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
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

@media only screen and (min-width: 280px) and (max-width: 540px) {
  .main-div {
    margin: 0 5px 0 5px;
  }
}
input, select, option, textarea {
  border: 1px solid grey;
}
.pdf-url{
  cursor: pointer;
}
</style>
