<script setup>
import api from "../api/api";
import ButtonSubmit from "./ButtonSubmit.vue";
import HomeViewSampleReport from "./HomeViewSampleReport.vue";
import Swal from "sweetalert2";
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
        surveyReportByProgramAndIteration.length == 0 &&
        tippingPointReport.length == 0 &&
        pressurePointReport.length == 0
      "
    >
      <h2>No coaching report(s) available.</h2>
    </div>

    <!--survey report-->
    <div
      class="parent"
      v-show="toggle"
      v-for="reports in surveyReportByProgramAndIteration"
      :key="reports"
    >
      <div
        class="bg-main-color1"
        style="
          padding: 10px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          width: 100%;
        "
      >
        <div>
          <strong
            >Program: {{ reports.program_name }} Iteration:
            {{ reports.iteration_name }} Reports:
            {{ reports.report_template_name }}</strong
          >
        </div>
        <button
          class="bg-main-color1"
          style="color: #fff"
          @click.prevent="reports.reportToggle = !reports.reportToggle"
          v-show="!reports.reportToggle"
        >
          Show
        </button>
        <button
          class="bg-main-color1"
          style="color: #fff"
          @click.prevent="reports.reportToggle = !reports.reportToggle"
          v-show="reports.reportToggle"
        >
          Hide
        </button>
      </div>
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in reports.report_details"
        :key="report"
        v-show="reports.reportToggle"
      >
        <div>
          <h4>Coachee Individual Report</h4>
          <hr />
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
          <div v-if="report.survey_type == 5">
            <img
              class="surveyLogo"
              src="../../public/survey_logo/VFP_logo.png"
            />
          </div>
        </div>
        <!-- <a href="#">View Sample Individual Report</a> -->

        <!--360-->

        <div
          class="tooltip"
          v-if="
            report.not_eligible == 1 &&
            report.dropped_status == 0 &&
            report.report_file.includes('360')
          "
        >
          Is your coachee eligible?
          <span class="tooltiptext"
            >- Your coachee must have 2 respondents <br /><br />
            - You coachee must have a self assessment</span
          >
        </div>

        <ButtonSubmit
          v-if="
            report.coach_access_granted == 0 &&
            report.dropped_status == 0
          "
          disabled
          label="No permission to view"
          style="margin-top: 10px"
        />
        <ButtonSubmit
          v-if="
            report.not_eligible == 1 &&
            report.dropped_status == 0 &&
            report.report_file.includes('360')
          "
          disabled
          label="Not eligible for a report"
          style="margin-top: 10px"
        />

        <a
        v-if="
            report.coach_access_granted == 1 &&
            report.not_eligible == 0 &&
            report.dropped_status == 0 &&
            report.report_file.includes('360')
          "
          class="pdf-url"
          @click="showReportPdf(report.full_name, 
          report.report_template_name, 
          report.survey_assignment_id)"
          >Show {{ report.report_template_name }} pdf</a
        >
        <!-- 360 button -->
        <button
          class="btn-submit"
          v-if="
            report.coach_access_granted == 1 &&
            report.not_eligible == 0 &&
            report.dropped_status == 0 &&
            report.report_file.includes('360')
          "
          @click="openInNewTab360Report(`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`, report.final_deadline_date)"
          >View Individual Report</button
        >

        <!--Big five or Big 5 view report button-->
        <!-- <a
        v-if="
            report.dropped_status == 0 &&
            report.coach_access_granted == 1 &&
            report.report_file.includes('5Step')
          "
          class="pdf-url"
          @click="showReportPdf(report.full_name, 
          report.report_template_name, 
          report.survey_assignment_id)"
          >Show {{ report.report_template_name }} pdf</a
        > -->
        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            report.coach_access_granted == 1 &&
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
          }&iteration_id=${report.iteration_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >View Individual Report</a
        >

        <!-- VFP button -->

        <!-- <a
        v-if="
            report.dropped_status == 0 &&
            report.coach_access_granted == 1 &&
            report.report_file.includes('VFP')
          "
          class="pdf-url"
          @click="showReportPdf(report.full_name, 
          report.report_template_name, 
          report.survey_assignment_id)"
          >Show {{ report.report_template_name }} pdf</a
        > -->

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            report.coach_access_granted == 1 &&
            report.report_file.includes('VFP')
          "
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_name=${report.org_name}&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >View Individual Report</a
        >

        <!-- Global button -->

        <!-- <a
        v-if="
            report.dropped_status == 0 &&
            report.coach_access_granted == 1 &&
            !report.report_file.includes('5Step') &&
            !report.report_file.includes('VFP') &&
            !report.report_file.includes('360')
          "
          class="pdf-url"
          @click="showReportPdf(report.full_name, 
          report.report_template_name, 
          report.survey_assignment_id)"
          >Show {{ report.report_template_name }} pdf</a
        > -->

        <a
          class="btn-submit"
          v-if="
            report.dropped_status == 0 &&
            report.coach_access_granted == 1 &&
            !report.report_file.includes('5Step') &&
            !report.report_file.includes('VFP') &&
            !report.report_file.includes('360')
          "
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
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

        <div class="tooltip" v-if="coachId" style="margin-top: 10px">
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
          v-if="coachId"
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <!--Tipping point report-->
    <div
      class="parent"
      v-show="toggle"
      v-for="reports in tippingPointReport"
      :key="reports"
    >
      <div
        class="bg-main-color1"
        style="
          padding: 10px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          width: 100%;
        "
      >
        <div>
          <strong
            >Program: {{ reports.program_name }} Iteration:
            {{ reports.iteration_name }} Reports:
            {{ reports.report_template_name }}</strong
          >
        </div>
        <button
          class="bg-main-color1"
          style="color: #fff"
          @click.prevent="reports.reportToggle = !reports.reportToggle"
          v-show="!reports.reportToggle"
        >
          Show
        </button>
        <button
          class="bg-main-color1"
          style="color: #fff"
          @click.prevent="reports.reportToggle = !reports.reportToggle"
          v-show="reports.reportToggle"
        >
          Hide
        </button>
      </div>
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in reports.report_details"
        :key="report"
        v-show="reports.reportToggle"
      >
        <div>
          <h4>Coachee Individual Report</h4>
          <hr />
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

        <!--Tipping point view report button-->

        <ButtonSubmit
          v-if="
            report.dropped_status == 0 &&
            report.coach_access_granted == 0 &&
            report.report_file == 'TIPpingPointReport.html'
          "
          disabled
          label="No permission to view"
          style="margin-top: 10px"
        />


        <!-- <a
        v-if="
            report.report_file.includes('TIPping') &&
            report.dropped_status == 0 &&
            report.coach_access_granted == 1
          "
          class="pdf-url"
          @click="showReportPdf(report.full_name, 
          report.report_template_name, 
          report.survey_assignment_id)"
          >Show {{ report.report_template_name }} pdf</a
        > -->

        <a
          class="btn-submit"
          v-if="
            report.report_file.includes('TIPping') &&
            report.dropped_status == 0 &&
            report.coach_access_granted == 1
          "
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >View Individual Report</a
        >

        <ButtonSubmit
          v-if="
            report.dropped_status == 1 &&
            report.report_file.includes('TIPping')
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />

        <div class="tooltip" v-if="coachId" style="margin-top: 10px">
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
          v-if="coachId"
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <!--pressure point report-->
    <div
      class="parent"
      v-show="toggle"
      v-for="reports in pressurePointReport"
      :key="reports"
    >
      <div
        class="bg-main-color1"
        style="
          padding: 10px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          width: 100%;
        "
      >
        <div>
          <strong
            >Program: {{ reports.program_name }} Iteration:
            {{ reports.iteration_name }} Reports:
            {{ reports.report_template_name }}</strong
          >
        </div>
        <button
          class="bg-main-color1"
          style="color: #fff"
          @click.prevent="reports.reportToggle = !reports.reportToggle"
          v-show="!reports.reportToggle"
        >
          Show
        </button>
        <button
          class="bg-main-color1"
          style="color: #fff"
          @click.prevent="reports.reportToggle = !reports.reportToggle"
          v-show="reports.reportToggle"
        >
          Hide
        </button>
      </div>
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in reports.report_details"
        :key="report"
        v-show="reports.reportToggle"
      >
        <div>
          <h4>Coachee Individual Report</h4>
          <hr />
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

        <!--Pressure point view report button-->

        <ButtonSubmit
          v-if="
            report.dropped_status == 0 &&
            report.coach_access_granted == 0 &&
            report.report_file.includes('Pressure')
          "
          disabled
          label="No permission to view"
          style="margin-top: 10px"
        />

        <!-- <a
        v-if="
            report.report_file.includes('Pressure') &&
            report.dropped_status == 0 &&
            report.coach_access_granted == 1
          "
          class="pdf-url"
          @click="showReportPdf(report.full_name, 
          report.report_template_name, 
          report.survey_assignment_id)"
          >Show {{ report.report_template_name }} pdf</a
        > -->


        <a
          class="btn-submit"
          v-if="
            report.report_file.includes('Pressure') &&
            report.dropped_status == 0 &&
            report.coach_access_granted == 1
          "
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >View Individual Report</a
        >

        <ButtonSubmit
          v-if="
            report.dropped_status == 1 &&
            report.report_file.includes('Pressure')
          "
          disabled
          label="Dropped"
          style="margin-top: 10px"
        />

        <div class="tooltip" v-if="coachId" style="margin-top: 10px">
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
          v-if="coachId"
          :href="`${brandData.website_url + report.report_file}?sex=${
            report.gender
          }&country=${report.country}&viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <!--Coach Group report-->
    <div class="parent" v-show="toggle" v-if="coachGroup5StepReport.length > 0">
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in coachGroup5StepReport"
        :key="report"
      >
        <div>
          <h4>Coaching Group Report</h4>
          <hr />
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
          <h3 v-if="report.group_name != null">
            For group: {{ report.group_name }}
          </h3>
          <h3 v-else-if="report.group_name == null">For group: (No group)</h3>
        </div>
        <div>
          <img
            class="surveyLogo"
            src="../../public/survey_logo/big5_survey_logo.png"
          />
        </div>

        <a
          class="sample-report-href"
          @click="
            showCoachGroupSampleReport(
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

        <!--Coach group view report button-->

        <a
          class="btn-submit"
          v-if="
            report.report_file.includes('Coach') ||
            report.report_file.includes('coach')"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >View Group Report</a
        >

        <div class="tooltip" v-if="coachId" style="margin-top: 10px">
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
          v-if="coachId"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <!--5Step-->
    <div
      class="parent"
      v-show="toggle"
      v-if="coachProgram5StepReport.length > 0"
    >
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in coachProgram5StepReport"
        :key="report"
      >
        <div>
          <h4>Coaching Group Report</h4>
          <hr />
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
          <h3 v-if="report.group_name != null">
            For group: {{ report.group_name }}
          </h3>
          <h3 v-else-if="report.group_name == null">For group: (No group)</h3>
        </div>
        <div>
          <img
            class="surveyLogo"
            src="../../public/survey_logo/big5_survey_logo.png"
          />
        </div>

        <a
          class="sample-report-href"
          @click="
            showCoachGroupSampleReport(
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
        <!--Coach group view report button-->

        <a
          class="btn-submit"
          v-if="
            report.report_file.includes('Coach') ||
            report.report_file.includes('coach')"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >View Group Report</a
        >

        <div class="tooltip" v-if="coachId" style="margin-top: 10px">
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
          v-if="coachId"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <!--Tipping point-->
    <div
      class="parent"
      v-show="toggle"
      v-if="coachTippingReportSorted.length > 0"
    >
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in coachTippingReportSorted"
        :key="report"
      >
        <div>
          <h4>Coaching Group Report</h4>
          <hr />
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
          <h3 v-if="report.group_name != null">
            For group: {{ report.group_name }}
          </h3>
          <h3 v-else-if="report.group_name == null">For group: (No group)</h3>
        </div>
        <div>
          <img
            class="surveyLogo"
            src="../../public/survey_logo/tipping_point_logo.png"
          />
        </div>

        <a
          class="sample-report-href"
          @click="
            showCoachGroupSampleReport(
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
        <!--Coach group view report button-->

        <a
          class="btn-submit"
          v-if="
            report.report_file.includes('Coach') ||
            report.report_file.includes('coach')"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >View Group Report</a
        >
        <div class="tooltip" v-if="coachId" style="margin-top: 10px">
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
          v-if="coachId"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <!--Pressure point-->
    <div
      class="parent"
      v-show="toggle"
      v-if="coachPressureReportSorted.length > 0"
    >
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in coachPressureReportSorted"
        :key="report"
      >
        <div>
          <h4>Coaching Group Report</h4>
          <hr />
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
          <h3 v-if="report.group_name != null">
            For group: {{ report.group_name }}
          </h3>
          <h3 v-else-if="report.group_name == null">For group: (No group)</h3>
        </div>
        <div>
          <img
            class="surveyLogo"
            src="../../public/survey_logo/pressure_point_logo.png"
          />
        </div>

        <a
          class="sample-report-href"
          @click="
            showCoachGroupSampleReport(
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
        <!--Coach group view report button-->

        <a
          class="btn-submit"
          v-if="
            report.report_file.includes('Coach') ||
            report.report_file.includes('coach')"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >View Group Report</a
        >

        <div class="tooltip" v-if="coachId" style="margin-top: 10px">
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
          v-if="coachId"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <!--TS 360-->
    <div
      class="parent"
      v-show="toggle"
      v-if="coachProgramTalentSage360Report.length > 0"
    >
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in coachProgramTalentSage360Report"
        :key="report"
      >
        <div>
          <h4>Coaching Group Report</h4>
          <hr />
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
          <h3 v-if="report.group_name != null">
            For group: {{ report.group_name }}
          </h3>
          <h3 v-else-if="report.group_name == null">For group: (No group)</h3>
        </div>
        <div>
          <img
            class="surveyLogo"
            src="../../public/survey_logo/360_survey_logo.png"
          />
        </div>

        <a
          class="sample-report-href"
          @click="
            showCoachGroupSampleReport(
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
        <!--Coach group view report button-->

        <a
          class="btn-submit"
          v-if="
            report.report_file.includes('Coach') ||
            report.report_file.includes('coach')"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >View Group Report</a
        >

        <div class="tooltip" v-if="coachId" style="margin-top: 10px">
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
          v-if="coachId"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <!--Gen Man 360-->
    <div
      class="parent"
      v-show="toggle"
      v-if="coachProgramGeneralManager360Report.length > 0"
    >
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in coachProgramGeneralManager360Report"
        :key="report"
      >
        <div>
          <h4>Coaching Group Report</h4>
          <hr />
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
          <h3 v-if="report.group_name != null">
            For group: {{ report.group_name }}
          </h3>
          <h3 v-else-if="report.group_name == null">For group: (No group)</h3>
        </div>
        <div>
          <img
            class="surveyLogo"
            src="../../public/survey_logo/360_survey_logo.png"
          />
        </div>

        <a
          class="sample-report-href"
          @click="
            showCoachGroupSampleReport(
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

        <!--Coach group view report button-->

        <a
          class="btn-submit"
          v-if="
            report.report_file.includes('Coach') ||
            report.report_file.includes('coach')"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >View Group Report</a
        >

        <div class="tooltip" v-if="coachId" style="margin-top: 10px">
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
          v-if="coachId"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <!--Sep 360-->
    <div
      class="parent"
      v-show="toggle"
      v-if="coachProgramSeniorExecProgram360Report.length > 0"
    >
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in coachProgramSeniorExecProgram360Report"
        :key="report"
      >
        <div>
          <h4>Coaching Group Report</h4>
          <hr />
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
          <h3 v-if="report.group_name != null">
            For group: {{ report.group_name }}
          </h3>
          <h3 v-else-if="report.group_name == null">For group: (No group)</h3>
        </div>
        <div>
          <img
            class="surveyLogo"
            src="../../public/survey_logo/360_survey_logo.png"
          />
        </div>

        <a
          class="sample-report-href"
          @click="
            showCoachGroupSampleReport(
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

        <!--Coach group view report button-->

        <a
          class="btn-submit"
          v-if="
            report.report_file.includes('Coach') ||
            report.report_file.includes('coach')"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >View Group Report</a
        >
        <div class="tooltip" v-if="coachId" style="margin-top: 10px">
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
          v-if="coachId"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <!--Team Leader 360-->
    <div
      class="parent"
      v-show="toggle"
      v-if="coachProgramTeamLeader360Report.length > 0"
    >
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in coachProgramTeamLeader360Report"
        :key="report"
      >
        <div>
          <h4>Coaching Group Report</h4>
          <hr />
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
          <h3 v-if="report.group_name != null">
            For group: {{ report.group_name }}
          </h3>
          <h3 v-else-if="report.group_name == null">For group: (No group)</h3>
        </div>
        <div>
          <img
            class="surveyLogo"
            src="../../public/survey_logo/360_survey_logo.png"
          />
        </div>

        <a
          class="sample-report-href"
          @click="
            showCoachGroupSampleReport(
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

        <!--Coach group view report button-->
        <a
          class="btn-submit"
          v-if="
            report.report_file.includes('Coach') ||
            report.report_file.includes('coach')"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >View Group Report</a
        >

        <div class="tooltip" v-if="coachId" style="margin-top: 10px">
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
          v-if="coachId"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <!--Help 360-->
    <div class="parent" v-show="toggle" v-if="coachHelp360Report.length > 0">
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in coachHelp360Report"
        :key="report"
      >
        <div>
          <h4>Coaching Group Report</h4>
          <hr />
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
          <h3 v-if="report.group_name != null">
            For group: {{ report.group_name }}
          </h3>
          <h3 v-else-if="report.group_name == null">For group: (No group)</h3>
        </div>
        <div>
          <img
            class="surveyLogo"
            src="../../public/survey_logo/360_survey_logo.png"
          />
        </div>

        <a
          class="sample-report-href"
          @click="
            showCoachGroupSampleReport(
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

        <!--Coach group view report button-->
        <a
          class="btn-submit"
          v-if="
            report.report_file.includes('Coach') ||
            report.report_file.includes('coach')"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >View Group Report</a
        >

        <div class="tooltip" v-if="coachId" style="margin-top: 10px">
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
          v-if="coachId"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <!--EuroNav 360-->
    <div class="parent" v-show="toggle" v-if="coachEuroNav360Report.length > 0">
      <div
        class="child"
        style="background-color: #cdcdcd"
        v-for="report in coachEuroNav360Report"
        :key="report"
      >
        <div>
          <h4>Coaching Group Report</h4>
          <hr />
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
          <h3 v-if="report.group_name != null">
            For group: {{ report.group_name }}
          </h3>
          <h3 v-else-if="report.group_name == null">For group: (No group)</h3>
        </div>
        <div>
          <img
            class="surveyLogo"
            src="../../public/survey_logo/360_survey_logo.png"
          />
        </div>

        <a
          class="sample-report-href"
          @click="
            showCoachGroupSampleReport(
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

        <!--Coach group view report button-->
        <a
          class="btn-submit"
          v-if="
            report.report_file.includes('Coach') ||
            report.report_file.includes('coach')"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >View Group Report</a
        >

        <div class="tooltip" v-if="coachId" style="margin-top: 10px">
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
          v-if="coachId"
          :href="`${
            brandData.website_url + report.report_file
          }?viewer_fullname=${
            userData.first_name + ' ' + userData.last_name
          }&report_for_fullname=${report.full_name}&survey_assignment_id=${
            report.survey_assignment_id
          }&org_id=${report.org_id}&subOrg_id=${report.suborg_id}&program_id=${
            report.program_id
          }&iteration_id=${report.iteration_id}&stream_id=${report.stream_id}&group_id=${report.group_id}&coach_id=${
            report.coach_id
          }&survey_template_id=${report.survey_template_id}&rand=${rand}`"
          target="_blank"
          >Admin access to report</a
        >
      </div>
    </div>

    <HomeViewSampleReport
      v-if="showCoachGroupSampleModal == true"
      @close-modal="showCoachGroupSampleModal = false"
      :surveyAssignmentId="survey_assignment_id"
      :suborg="suborg_id"
      :surveyTemplateId="survey_template_id"
      :programId="program_id"
      :iterationId="iteration_id"
      :coachId="coach_id"
      :orgId="org_id"
      :reportForFullName="report_for_fullname"
      :viewerFullName="viewer_fullname"
      :reportLink="report_link"
      :brandData="brandData"
      :userData="userData"
    />

    <HomeViewSampleReport
      v-if="showCoachSampleModal == true"
      @close-modal="showCoachSampleModal = false"
      :surveyAssignmentId="survey_assignment_id"
      :suborg="suborg_id"
      :surveyTemplateId="survey_template_id"
      :programId="program_id"
      :iterationId="iteration_id"
      :coachId="coach_id"
      :orgId="org_id"
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
  name: "HomeCohortReports",
  data: () => ({
    showCoachGroupSampleModal: false,
    showCoachSampleModal: false,
    toggle: true,
    reportData: [],
    org_id: "",
    survey_assignment_id: 0,
    suborg_id: "",
    survey_template_id: "",
    program_id: "",
    iteration_id: "",
    coach_id: 0,
    report_for_fullname: "",
    viewer_fullname: "",
    report_link: "",
    reportGroupData: [],
    rand: "",
    pdfReportTemplateId: ""
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
    coachId: Number,
  },
  async mounted() {
    this.rand = Math.random()
    // console.log(this.userData);
    // await api
    //   .get(`get-participant-reports/${this.userData.ind_id}`)
    //   .then((res) => {
    //     this.reportData = res.data;
    //     // console.log(this.reportData);
    //   });
    if (this.coachId) {
      await api
        .get(`get-coach-reports-by-admin/${this.coachId}`)
        .then((res) => {
          this.reportData = res.data;
        console.log(res.data);
          this.reportData.forEach((dataEle) => {
            // look for matching elements between the two object arrays
            let existingRgd = this.reportGroupData.find(
              (rgd) =>
                rgd?.report_template_name === dataEle.report_template_name &&
                rgd?.program_name === dataEle.program_name &&
                rgd?.iteration_name === dataEle.iteration_name
            );
            // if match is found, add to existing element's report_details array
            if (existingRgd) {
              existingRgd.report_details.push(dataEle);
              // else create new element
            } else {
              this.reportGroupData.push({
                ...dataEle,
                reportToggle: true, // adds all fields of dataEle
                report_details: [dataEle],
              });
            }
          });

          this.reportGroupData.map((data) => {
            data.report_details.sort((a, b) =>
              a.full_name.localeCompare(b.full_name)
            );
          });

          if (this.reportData.length > 0) {
            for (var i = 0; i < this.reportData.length; i++) {
              if (this.reportData[i].survey_assignment_id != 0) {
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
            console.log(this.reportData);
          }
        });
    } else {
      await api.get(`get-coach-reports/${this.userData.ind_id}`).then((res) => {
        this.reportData = res.data;
        console.log(res.data);
        this.reportData.forEach((dataEle) => {
          // look for matching elements between the two object arrays
          let existingRgd = this.reportGroupData.find(
            (rgd) =>
              rgd?.report_template_name === dataEle.report_template_name &&
              rgd?.program_name === dataEle.program_name &&
              rgd?.iteration_name === dataEle.iteration_name
          );
          // if match is found, add to existing element's report_details array
          if (existingRgd) {
            existingRgd.report_details.push(dataEle);
            // else create new element
          } else {
            this.reportGroupData.push({
              ...dataEle,
              reportToggle: true, // adds all fields of dataEle
              report_details: [dataEle],
            });
          }
        });

        this.reportGroupData.map((data) => {
          data.report_details.sort((a, b) =>
            a.full_name.localeCompare(b.full_name)
          );
        });

        if (this.reportData.length > 0) {
          for (var i = 0; i < this.reportData.length; i++) {
            if (this.reportData[i].survey_assignment_id != 0) {
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
          console.log(this.reportData);
        }
      });
    }
  },
  methods: {
    // async showReportPdf(reportFullName, reportTemplateName, surveyAssignmentId){
    //   this.setLoading = true
    //   let url = null
    //   const pdfName = this.removeSpaces(reportFullName+reportTemplateName)
    //   const requestBodyForCoach = {
    //         report_template_id: pdfName,
    //         survey_assignment_id: surveyAssignmentId,
    //       };

    //   await api.post("/get-pdf-generated-for-coach", requestBodyForCoach)
    //   .then(async (res)=>{
    //     this.pdfReportTemplateId = res.data

    //     if(this.setLoading === true){
    //     this.showPdfAlert()
    //   }
    //     try {
    //       const requestBody = {
    //         report_template_id: this.pdfReportTemplateId,
    //         survey_assignment_id: surveyAssignmentId,
    //       };

    //       const response = await api.post('/get-pdf-content', requestBody, {
    //         responseType: 'blob', // Specify the response type as blob
    //       });
  
    //       // Create a blob URL from the response data
    //       const blob = new Blob([response.data], { type: 'application/pdf' });
    //       url = window.URL.createObjectURL(blob);

    //       if(url !== null){
    //         window.open(url, '_blank');
    //         this.setLoading = false
    //         if(this.setLoading === false){
    //           this.hidePdfAlert()
    //           console.log("URL ", url)
    //         }
    //       }
    //       // Open the PDF in a new tab
          
    //     } catch (error) {
    //       console.error('Error downloading PDF:', error);
    //       // Handle errors here
    //     }
    //   })
    // },

    // async showPdfAlert(){
    //   Swal.fire({
    //     title: "Preparing your pdf, please wait...",
    //     allowOutsideClick: false,
    //     didOpen: () => {
    //       Swal.showLoading();
    //     },
    //   });
    // },

    // async hidePdfAlert(){
    //   Swal.close()
    // },

    // async removeSpaces(inputString) {
    //   return inputString.replace(/\s/g, '');
    // },
    
    myReport(
      report_file,
      survey_assignment_id,
      report_full_name,
      report_program_id,
      report_iteration_id,
      report_org_id,
      report_suborg_id,
      report_survey_template_id,
      report_coach_id
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
              survey_template_id: report_survey_template_id,
              coach_id: report_coach_id,
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
              survey_template_id: report_survey_template_id,
              coach_id: report_coach_id,
            };
          }
          this.$router.push({
            name: "MyReport",
            params: { data: JSON.stringify(data) },
          });
        });
    },

    myCoachGroupReport(
      report_file,
      survey_assignment_id,
      report_program_id,
      report_iteration_id,
      report_org_id,
      report_suborg_id,
      report_survey_template_id,
      report_coach_id
    ) {
      // get sex and country first
      let data;
      data = {
        survey_assignment_id: survey_assignment_id,
        report_link: this.brandData.website_url + report_file,
        report_for_fullname:
          this.userData.first_name + " " + this.userData.last_name,
        org_id: report_org_id,
        suborg_id: report_suborg_id,
        program_id: report_program_id,
        iteration_id: report_iteration_id,
        survey_template_id: report_survey_template_id,
        coach_id: report_coach_id,
      };
      this.$router.push({
        name: "MyReport",
        params: { data: JSON.stringify(data) },
      });
    },

    showCoachGroupSampleReport(
      report_file,
      survey_assignment_id,
      full_name,
      program_id,
      iteration_id,
      org_id,
      suborg_id,
      survey_template_id
    ) {
      this.showCoachSampleModal = true;
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

    showCoachSampleReport(
      report_file,
      survey_template_id,
      survey_assignment_id,
      program_id,
      iteration_id,
      org_id,
      suborg_id,
      coach_id,
      full_name
    ) {
      this.showCoachSampleModal = true;
      this.viewer_fullname =
        this.userData.first_name + " " + this.userData.last_name;
      this.report_for_fullname = full_name;
      this.report_link = this.brandData.website_url + report_file;
      this.suborg_id = suborg_id;
      this.survey_template_id = survey_template_id;
      this.program_id = program_id;
      this.iteration_id = iteration_id;
      this.org_id = org_id;
      this.coach_id = coach_id;
      this.survey_assignment_id = survey_assignment_id;
    },
    openInNewTab360Report(url, finalDeadlineDate) {
      const today = (new Date()).toLocaleString("en-US")
      
      if(finalDeadlineDate > today){
        Swal.fire({
          text: "The Program is still open. Participant and Cohort Scores are subject to change.",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: this.brandData.accent_color1,
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(url, '_blank', 'noreferrer');
          }
        })
      }else{
        window.open(url, '_blank', 'noreferrer');
      }

    },

  },

  computed: {
    surveyReportByProgramAndIteration: function () {
      return this.reportGroupData
        .sort((a, b) =>
          a.report_template_name.localeCompare(b.report_template_name)
        )
        .filter(function (el) {
          return (
            el.report_file != "TIPpingPointReport.html" &&
            el.report_file != "PressurePointReport.html" &&
            el.report_file != "TIPpingPointCoachReport.html" &&
            el.report_file != "PressurePointCoachReport.html" &&
            el.report_file != "5StepCoachReport.html" &&
            el.report_file != "TalentSage360CoachReport.html" &&
            el.report_file != "GeneralManager360CoachReport.html" &&
            el.report_file != "SeniorExecProgram360CoachReport.html" &&
            el.report_file != "TeamLeader360CoachReport.html" &&
            el.report_file != "EURONAV360CoachReport.html" &&
            el.report_file != "HELP360CoachReport.html" &&
            !el.report_file.includes("Coach") &&
            !el.report_file.includes("coach") 
          );
        }, this);
    },

    tippingPointReport: function () {
      return this.tippingPointReportFilter.sort((a, b) =>
        a.full_name.localeCompare(b.full_name)
      );
    },

    tippingPointReportFilter: function () {
      return this.reportGroupData.filter(function (el) {
        return (
          el.tag_type == "has_coach_tipping_point" &&
          el.report_file == "TIPpingPointReport.html"
        );
      }, this);
    },

    pressurePointReport: function () {
      return this.pressurePointReportFilter.sort((a, b) =>
        a.full_name.localeCompare(b.full_name)
      );
    },

    pressurePointReportFilter: function () {
      return this.reportGroupData.filter(function (el) {
        return (
          el.tag_type == "has_coach_pressure_point" &&
          el.report_file == "PressurePointReport.html"
        );
      }, this);
    },

    alphabeticalOrderWithGroupCoachGroupReport: function () {
      return this.reportData.filter(function (el) {
        return el.group_name != null;
      }, this);
    },

    alphabeticalOrderWithoutGroupCoachGroupReport: function () {
      return this.reportData.filter(function (el) {
        return el.group_name == null;
      }, this);
    },

    coachProgram5StepReport: function () {
      return this.alphabeticalOrderWithoutGroupCoachGroupReport
        .sort((a, b) => a.program_name.localeCompare(b.program_name))
        .filter(function (el) {
          return (
            el.report_file.includes('5 Step Coach') ||
            el.report_file.includes('5 step coach') ||
            el.report_file.includes('5StepCoach') &&
            el.is_coach_report == 1 &&
            el.is_group_report == 1 &&
            el.coach_access_granted == 1
          );
        }, this);
    },

    coachGroup5StepReport: function () {
      return this.alphabeticalOrderWithGroupCoachGroupReport
        .sort((a, b) => a.group_name.localeCompare(b.group_name))
        .filter(function (el) {
          return (
            el.report_file.includes('5 Step Coach') ||
            el.report_file.includes('5 step coach') ||
            el.report_file.includes('5StepCoach') &&
            el.is_coach_report == 1 &&
            el.is_group_report == 1 &&
            el.coach_access_granted == 1
          );
        }, this);
    },

    coachTippingReport: function () {
      return this.reportData.filter(function (el) {
        return (
            el.report_file.includes('Tipping Point Coach') ||
            el.report_file.includes('tipping point coach') ||
            el.report_file.includes('TIPpingPointCoach') &&
            el.is_coach_report == 1 &&
            el.is_group_report == 1 &&
            el.coach_access_granted == 1
        );
      }, this);
    },

    coachTippingReportSorted: function () {
      return this.coachTippingReport.sort((a, b) =>
        a.program_name.localeCompare(b.program_name)
      );
    },

    coachPressureReport: function () {
      return this.reportData.filter(function (el) {
        return (
            el.report_file.includes('Pressure Point Coach') ||
            el.report_file.includes('pressure point coach') ||
            el.report_file.includes('PressurePointCoach') &&
            el.is_coach_report == 1 &&
            el.is_group_report == 1 &&
            el.coach_access_granted == 1
        );
      }, this);
    },

    coachPressureReportSorted: function () {
      return this.coachPressureReport.sort((a, b) =>
        a.program_name.localeCompare(b.program_name)
      );
    },

    coachProgramTalentSage360Report: function () {
      return this.alphabeticalOrderWithGroupCoachGroupReport
        .sort((a, b) => a.program_name.localeCompare(b.program_name))
        .filter(function (el) {
          return (
            el.report_file.includes('TalentSage 360 Coach') ||
            el.report_file.includes('Talent Sage Coach') ||
            el.report_file.includes('talent sage coach') ||
            el.report_file.includes('talentsage 360 coach') ||
            el.report_file.includes('TalentSage360Coach') &&
            el.is_coach_report == 1 &&
            el.is_group_report == 1 &&
            el.coach_access_granted == 1
          );
        }, this);
    },

    coachProgramGeneralManager360Report: function () {
      return this.alphabeticalOrderWithGroupCoachGroupReport
        .sort((a, b) => a.program_name.localeCompare(b.program_name))
        .filter(function (el) {
          return (
            el.report_file.includes('General Manager 360 Coach') ||
            el.report_file.includes('General Manager Coach') ||
            el.report_file.includes('general manager coach') ||
            el.report_file.includes('general manager 360 coach') ||
            el.report_file.includes('GeneralManager360Coach') &&
            el.is_coach_report == 1 &&
            el.is_group_report == 1 &&
            el.coach_access_granted == 1
          );
        }, this);
    },

    coachProgramSeniorExecProgram360Report: function () {
      return this.alphabeticalOrderWithGroupCoachGroupReport
        .sort((a, b) => a.program_name.localeCompare(b.program_name))
        .filter(function (el) {
          return (
            el.report_file.includes('Senior Executive Program 360 Coach') ||
            el.report_file.includes('SEP360Coach') ||
            el.report_file.includes('senior executive program 360 coach') ||
            el.report_file.includes('senior executive program 360') ||
            el.report_file.includes('SeniorExecProgram360Coach') &&
            el.is_coach_report == 1 &&
            el.is_group_report == 1 &&
            el.coach_access_granted == 1
          );
        }, this);
    },

    coachProgramTeamLeader360Report: function () {
      return this.alphabeticalOrderWithGroupCoachGroupReport
        .sort((a, b) => a.program_name.localeCompare(b.program_name))
        .filter(function (el) {
          return (
            (el.report_file.includes('Team Leader 360 Coach') ||
            el.report_file.includes('TL360Coach') ||
            el.report_file.includes('team leader 360 coach') ||
            el.report_file.includes('Leader 360 Coach') ||
            el.report_file.includes('TeamLeader360Coach')) &&
            el.is_coach_report == 1 &&
            el.is_group_report == 1 &&
            el.coach_access_granted == 1
          );
        }, this);
    },

    coachHelp360Report: function () {
      return this.alphabeticalOrderWithGroupCoachGroupReport
        .sort((a, b) => a.program_name.localeCompare(b.program_name))
        .filter(function (el) {
          return (
            el.report_file.includes('HELP 360 Coach') ||
            el.report_file.includes('help 360 coach') ||
            el.report_file.includes('help360coach') ||
            el.report_file.includes('HELP360Coach') &&
            el.is_coach_report == 1 &&
            el.is_group_report == 1 &&
            el.coach_access_granted == 1
          );
        }, this);
    },

    coachEuroNav360Report: function () {
      return this.alphabeticalOrderWithGroupCoachGroupReport
        .sort((a, b) => a.program_name.localeCompare(b.program_name))
        .filter(function (el) {
          return (
            el.report_file.includes('EURONAV 360 Coach') ||
            el.report_file.includes('Euronav360Coach') ||
            el.report_file.includes('euronav360coach') ||
            el.report_file.includes('EURONAV360Coach') &&
            el.is_coach_report == 1 &&
            el.is_group_report == 1 &&
            el.coach_access_granted == 1
          );
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
  margin-top: 10px;
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

.pdf-url{
  cursor: pointer;
}
</style>
