<script setup>
import ButtonSubmit from "./ButtonSubmit.vue";
import api from "../api/api";
import HomeViewSampleReport from "./HomeViewSampleReport.vue";
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
      <h2>No faculty report(s) available.</h2>
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
          <h2>{{ report.iteration_name }}</h2>
          <h2>{{ report.report_template_name }}</h2>
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

        <a
          v-if="report.report_file == 'TeamLeader360FacultyReport.html'"
          class="sample-report-href"
          @click="
            showFacultySampleReport(
              'TeamLeader360Report.html',
              14850,
              'Sample User',
              38,
              61,
              1,
              17,
              31
            )
          "
          >View Sample Report</a
        >

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            report.report_file == 'TeamLeader360FacultyReport.html'
          "
          :href="`${
            brandData.website_url + report.report_file
          }?report_for_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&survey_assignment_id=${report.survey_assignment_id}&org_id=${
            report.org_id
          }&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&survey_template_id=${
            report.survey_template_id
          }&suborg_name=${report.suborg_name}&program_name=${
            report.program_name
          }&iteration_name=${report.iteration_name}`"
          target="_blank"
          >View Faculty Report</a
        >

        <ButtonSubmit
          v-if="
            report.dropped_status == 1 &&
            report.report_file == 'TeamLeader360FacultyReport.html'
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />

        <!--General Manager 360-->

        <a
          v-if="report.report_file == 'GeneralManager360FacultyReport.html'"
          class="sample-report-href"
          @click="
            showFacultySampleReport(
              'GeneralManager360Report.html',
              14846,
              'Sample User',
              38,
              60,
              1,
              17,
              25
            )
          "
          >View Sample Report</a
        >

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            // report.not_eligible == 0 &&
            report.report_file == 'GeneralManager360FacultyReport.html'
          "
          :href="`${
            brandData.website_url + report.report_file
          }?report_for_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&survey_assignment_id=${report.survey_assignment_id}&org_id=${
            report.org_id
          }&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&survey_template_id=${
            report.survey_template_id
          }&suborg_name=${report.suborg_name}&program_name=${
            report.program_name
          }&iteration_name=${report.iteration_name}`"
          target="_blank"
          >View Faculty Report</a
        >

        <ButtonSubmit
          v-if="
            report.dropped_status == 1 &&
            report.report_file == 'GeneralManager360FacultyReport.html'
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />

        <!--Alba 360-->

        <a
          v-if="report.report_file == 'ALBATeamLeader360FacultyReport.html'"
          class="sample-report-href"
          @click="
            showFacultySampleReport(
              'ALBATeamLeader360FacultyReport.html',
              14846,
              'Sample User',
              38,
              60,
              1,
              17,
              25
            )
          "
          >View Sample Report</a
        >

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            // report.not_eligible == 0 &&
            report.report_file == 'ALBATeamLeader360FacultyReport.html'
          "
          :href="`${
            brandData.website_url + report.report_file
          }?report_for_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&survey_assignment_id=${report.survey_assignment_id}&org_id=${
            report.org_id
          }&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&survey_template_id=${
            report.survey_template_id
          }&suborg_name=${report.suborg_name}&program_name=${
            report.program_name
          }&iteration_name=${report.iteration_name}`"
          target="_blank"
          >View Faculty Report</a
        >

        <ButtonSubmit
          v-if="
            report.dropped_status == 1 &&
            report.report_file == 'ALBATeamLeader360FacultyReport.html'
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />
        
        <!--SEP 360 report-->

        <a
          v-if="report.report_file == 'SeniorExecProgram360FacultyReport.html'"
          class="sample-report-href"
          @click="
            showFacultySampleReport(
              'SeniorExecProgram360Report.html',
              14848,
              'Sample User',
              38,
              63,
              1,
              17,
              27
            )
          "
          >View Sample Report</a
        >

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            // report.not_eligible == 0 &&
            report.report_file == 'SeniorExecProgram360FacultyReport.html'
          "
          :href="`${
            brandData.website_url + report.report_file
          }?report_for_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&survey_assignment_id=${report.survey_assignment_id}&org_id=${
            report.org_id
          }&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&survey_template_id=${
            report.survey_template_id
          }&suborg_name=${report.suborg_name}&program_name=${
            report.program_name
          }&iteration_name=${report.iteration_name}`"
          target="_blank"
          >View Faculty Report</a
        >

        <ButtonSubmit
          v-if="
            report.dropped_status == 1 &&
            report.report_file == 'SeniorExecProgram360FacultyReport.html'
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />

        <!--TalentSage 360 report-->

        <a
          v-if="report.report_file == 'TalentSage360FacultyReport.html'"
          class="sample-report-href"
          @click="
            showFacultySampleReport(
              'TalentSage360Report.html',
              14849,
              'Sample User',
              38,
              59,
              1,
              17,
              29
            )
          "
          >View Sample Report</a
        >

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            report.report_file == 'TalentSage360FacultyReport.html'
          "
          :href="`${
            brandData.website_url + report.report_file
          }?report_for_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&survey_assignment_id=${report.survey_assignment_id}&org_id=${
            report.org_id
          }&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&survey_template_id=${
            report.survey_template_id
          }&suborg_name=${report.suborg_name}&program_name=${
            report.program_name
          }&iteration_name=${report.iteration_name}`"
          target="_blank"
          >View Faculty Report</a
        >

        <ButtonSubmit
          v-if="
            report.dropped_status == 1 &&
            report.report_file == 'TalentSage360FacultyReport.html'
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />

        <!--HELP 360 report-->

        <a
          v-if="report.report_file == 'HELP360FacultyReport.html'"
          class="sample-report-href"
          @click="
            showFacultySampleReport(
              'HELP360Report.html',
              14847,
              'Sample User',
              38,
              62,
              1,
              17,
              33
            )
          "
          >View Sample Report</a
        >

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            // report.not_eligible == 0 &&
            report.report_file == 'HELP360FacultyReport.html'
          "
          :href="`${
            brandData.website_url + report.report_file
          }?report_for_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&survey_assignment_id=${report.survey_assignment_id}&org_id=${
            report.org_id
          }&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&survey_template_id=${
            report.survey_template_id
          }&suborg_name=${report.suborg_name}&program_name=${
            report.program_name
          }&iteration_name=${report.iteration_name}`"
          target="_blank"
          >View Faculty Report</a
        >

        <ButtonSubmit
          v-if="
            report.dropped_status == 1 &&
            report.report_file == 'HELP360FacultyReport.html'
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />

        <!--EuroNav360-->
        <a
          v-if="report.report_file == 'EURONAV360FacultyReport.html'"
          class="sample-report-href"
          @click="
            showFacultySampleReport(
              'EURONAV360Report.html',
              survey_assignment_id,
              'Sample User',
              38,
              61,
              1,
              17,
              23
            )
          "
          >View Sample Report</a
        >

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            // report.not_eligible == 0 &&
            report.report_file == 'EURONAV360FacultyReport.html'
          "
          :href="`${
            brandData.website_url + report.report_file
          }?report_for_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&survey_assignment_id=${report.survey_assignment_id}&org_id=${
            report.org_id
          }&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&survey_template_id=${
            report.survey_template_id
          }&suborg_name=${report.suborg_name}&program_name=${
            report.program_name
          }&iteration_name=${report.iteration_name}`"
          target="_blank"
          >View Faculty Report</a
        >

        <ButtonSubmit
          v-if="
            report.dropped_status == 1 &&
            report.report_file == 'EURONAV360FacultyReport.html'
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />

        <!--Big five or Big 5 view report button-->

        <a
          v-if="report.report_file == '5StepFacultyReport.html'"
          class="sample-report-href"
          @click="
            showFacultySampleReport(
              '5Step.html',
              14845,
              'Sample User',
              38,
              64,
              1,
              17,
              23
            )
          "
          >View Sample Report</a
        >

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            report.report_file == '5StepFacultyReport.html'
          "
          :href="`${
            brandData.website_url + report.report_file
          }?report_for_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&survey_assignment_id=${report.survey_assignment_id}&org_id=${
            report.org_id
          }&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&survey_template_id=${
            report.survey_template_id
          }&suborg_name=${report.suborg_name}&program_name=${
            report.program_name
          }&iteration_name=${report.iteration_name}`"
          target="_blank"
          >View Faculty Report</a
        >

        <ButtonSubmit
          v-if="
            report.dropped_status == 1 &&
            report.report_file == '5StepFacultyReport.html'
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />

        <div
          class="tooltip"
          v-if="facultyOrg && facultySuborg"
          style="margin-top: 10px"
        >
          Information
          <span class="tooltiptext"
            >- Above this tooltip shows exactly what the coach see in their
            report tile screen.
            <br />
            <br />- This tooltip and the button under this only shows for Admin
            to view the report.</span
          >
        </div>

        <a
          class="btn-submit"
          v-if="facultyOrg && facultySuborg"
          :href="`${
            brandData.website_url + report.report_file
          }?report_for_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&survey_assignment_id=${report.survey_assignment_id}&org_id=${
            report.org_id
          }&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&survey_template_id=${
            report.survey_template_id
          }&suborg_name=${report.suborg_name}&program_name=${
            report.program_name
          }&iteration_name=${report.iteration_name}`"
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
          <h2>{{ report.iteration_name }}</h2>
          <h2>{{ report.report_template_name }}</h2>
        </div>
        <div>
          <img
            class="surveyLogo"
            src="../../public/survey_logo/tipping_point_logo.png"
          />
        </div>
        <!-- <a href="#">View Sample Report</a> -->

        <a
          v-if="report.report_file == 'TIPpingPointFacultyReport.html'"
          class="sample-report-href"
          @click="
            showFacultySampleReport(
              'TIPpingPointReport.html',
              14845,
              'Sample User',
              38,
              64,
              1,
              17,
              23
            )
          "
          >View Sample Report</a
        >

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            report.report_file == 'TIPpingPointFacultyReport.html'
          "
          :href="`${
            brandData.website_url + report.report_file
          }?report_for_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&survey_assignment_id=${report.survey_assignment_id}&org_id=${
            report.org_id
          }&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&survey_template_id=${
            report.survey_template_id
          }&suborg_name=${report.suborg_name}&program_name=${
            report.program_name
          }&iteration_name=${report.iteration_name}`"
          target="_blank"
          >View Faculty Report</a
        >

        <ButtonSubmit
          v-if="
            report.dropped_status == 1 &&
            report.report_file == 'TIPpingPointFacultyReport.html'
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />

        <div
          class="tooltip"
          v-if="facultyOrg && facultySuborg"
          style="margin-top: 10px"
        >
          Information
          <span class="tooltiptext"
            >- Above this tooltip shows exactly what the coach see in their
            report tile screen.
            <br />
            <br />- This tooltip and the button under this only shows for Admin
            to view the report.</span
          >
        </div>

        <a
          class="btn-submit"
          v-if="facultyOrg && facultySuborg"
          :href="`${
            brandData.website_url + report.report_file
          }?report_for_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&survey_assignment_id=${report.survey_assignment_id}&org_id=${
            report.org_id
          }&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&survey_template_id=${
            report.survey_template_id
          }&suborg_name=${report.suborg_name}&program_name=${
            report.program_name
          }&iteration_name=${report.iteration_name}`"
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
          <h2>{{ report.iteration_name }}</h2>
          <h2>{{ report.report_template_name }}</h2>
        </div>
        <div>
          <img
            class="surveyLogo"
            src="../../public/survey_logo/pressure_point_logo.png"
          />
        </div>
        <!-- <a href="#">View Sample Report</a> -->

        <a
          v-if="report.report_file == 'PressurePointFacultyReport.html'"
          class="sample-report-href"
          @click="
            showFacultySampleReport(
              'PressurePointReport.html',
              14845,
              'Sample User',
              38,
              64,
              1,
              17,
              23
            )
          "
          >View Sample Report</a
        >

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            report.report_file == 'PressurePointFacultyReport.html'
          "
          :href="`${
            brandData.website_url + report.report_file
          }?report_for_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&survey_assignment_id=${report.survey_assignment_id}&org_id=${
            report.org_id
          }&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&survey_template_id=${
            report.survey_template_id
          }&suborg_name=${report.suborg_name}&program_name=${
            report.program_name
          }&iteration_name=${report.iteration_name}`"
          target="_blank"
          >View Faculty Report</a
        >

        <ButtonSubmit
          v-if="
            report.dropped_status == 1 &&
            report.report_file == 'PressurePointFacultyReport.html'
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />

        <div
          class="tooltip"
          v-if="facultyOrg && facultySuborg"
          style="margin-top: 10px"
        >
          Information
          <span class="tooltiptext"
            >- Above this tooltip shows exactly what the coach see in their
            report tile screen.
            <br />
            <br />- This tooltip and the button under this only shows for Admin
            to view the report.</span
          >
        </div>

        <a
          class="btn-submit"
          v-if="facultyOrg && facultySuborg"
          :href="`${
            brandData.website_url + report.report_file
          }?report_for_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&survey_assignment_id=${report.survey_assignment_id}&org_id=${
            report.org_id
          }&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&survey_template_id=${
            report.survey_template_id
          }&suborg_name=${report.suborg_name}&program_name=${
            report.program_name
          }&iteration_name=${report.iteration_name}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <HomeViewSampleReport
      v-if="showFacultySampleModal == true"
      @close-modal="showFacultySampleModal = false"
      :surveyAssignmentId="survey_assignment_id"
      :suborg="suborg_id"
      :surveyTemplateId="survey_template_id"
      :programId="program_id"
      :iterationId="iteration_id"
      :orgId="org_id"
      :suborgName="suborg_name"
      :programName="program_name"
      :iterationName="iteration_name"
      :reportForFullName="report_for_fullname"
      :viewerFullName="viewer_fullname"
      :reportLink="report_link"
      :brandData="brandData"
      :userData="userData"
    />
  </div>
</template>

<script>
export default {
  components: [ButtonSubmit, HomeViewSampleReport],
  name: "HomeFacultyReport",
  data: () => ({
    toggle: true,
    reportData: [],
    facultyIteration: "",
    joinSuborg: "",
    showFacultySampleModal: false,
    report_link: "",
    org_id: "",
    suborg_id: "",
    survey_template_id: "",
    program_id: "",
    iteration_id: "",
    suborg_name: "",
    program_name: "",
    iteration_name: "",
    report_for_fullname: "",
    survey_assignment_id: 0,
    viewer_fullname: "",
  }),
  async mounted() {
    if (this.facultyOrg && this.facultySuborg) {
      await api
        .get(`get-faculty-reports/${this.facultyOrg}/${this.facultySuborg}`)
        .then((res) => {
          this.reportData = res.data;
          console.log(res.data);
        });
    } else {
      var array = this.userData.suborgs.split(",");
      this.joinSuborg = array.join(",");

      await api
        .get(`get-faculty-reports/${this.userData.org_id}/${this.joinSuborg}`)
        .then((res) => {
          this.reportData = res.data;
          console.log(res.data);
        });
    }
  },
  props: [
    "userData",
    "brandData",
    "reportName",
    "surveyName",
    "dateTime",
    "buttonLabel",
    "label",
    "buttonColor",
    "facultyOrg",
    "facultySuborg",
  ],

  methods: {
    myReport(
      report_suborg_name,
      report_program_name,
      report_iteration_name,
      report_file,
      report_program_id,
      report_iteration_id,
      report_org_id,
      report_suborg_id,
      report_survey_template_id
    ) {
      // get sex and country first
      let data;

      data = {
        report_link: this.brandData.website_url + report_file,
        report_for_fullname:
          this.userData.first_name + " " + this.userData.last_name,
        org_id: report_org_id,
        suborg_id: report_suborg_id,
        program_id: report_program_id,
        iteration_id: report_iteration_id,
        survey_template_id: report_survey_template_id,
        ind_id: this.userData.ind_id,
        suborg_name: report_suborg_name,
        program_name: report_program_name,
        iteration_name: report_iteration_name,
      };
      this.$router.push({
        name: "MyReport",
        params: { data: JSON.stringify(data) },
      });
    },

    showFacultySampleReport(
      report_file,
      survey_assignment_id,
      full_name,
      program_id,
      iteration_id,
      org_id,
      suborg_id,
      survey_template_id
    ) {
      this.showFacultySampleModal = true;
      this.viewer_fullname =
        this.userData.first_name + " " + this.userData.last_name;
      this.report_for_fullname = full_name;
      this.report_link = this.brandData.website_url + report_file;
      this.suborg_id = suborg_id;
      this.survey_template_id = survey_template_id;
      this.program_id = program_id;
      this.iteration_id = iteration_id;
      this.org_id = org_id;
      this.survey_assignment_id = survey_assignment_id;
    },
  },

  computed: {
    surveyReport: function () {
      return this.reportData
        .sort((a, b) =>
          a.report_template_name.localeCompare(b.report_template_name)
        )
        .filter(function (el) {
          return (
            el.report_file != "TIPpingPointFacultyReport.html" &&
            el.report_file != "PressurePointFacultyReport.html"
          );
        }, this);
    },

    tippingPointReport: function () {
      return this.reportData.filter(function (el) {
        return el.report_file == "TIPpingPointFacultyReport.html";
      }, this);
    },

    pressurePointReport: function () {
      return this.reportData.filter(function (el) {
        return el.report_file == "PressurePointFacultyReport.html";
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
h4 {
  margin: 0;
}
.label-btn {
  color: #fff;
  background-color: #0e5071;
}
.parent {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px 0 10px;
  padding-bottom: 30px;
  margin-top: 20px;
  border: 2px solid transparent;
  border-radius: 20px;
  box-shadow: 0px 2px 10px -4px #000000;
}
.parent:hover {
  border-style: inset;
  border: 2px solid #888;
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
.surveyLogo {
  width: 150px;
  height: auto;
}
.btn-submit {
  text-decoration: none;
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
  padding: 10px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.sample-report-href {
  text-decoration: none;
  cursor: pointer;
  color: #0c5de9;
}
@media only screen and (min-width: 280px) and (max-width: 540px) {
  .main-div {
    margin: 0 5px 0 5px;
  }
}
</style>
