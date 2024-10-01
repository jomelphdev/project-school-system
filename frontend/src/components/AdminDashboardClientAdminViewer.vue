<script setup>
import DescriptionInline from "./DescriptionInline.vue";
import DropDownInfo from "./DropDownInfo.vue";
import DropDownInfoNumbered from "./DropDownInfoNumbered.vue";
import HeaderReport from "./HeaderReport.vue";
import FieldNameInline from "./FieldNameInline.vue";
import Header from "./Header.vue";
import api from "../api/api";
// import Swal from "sweetalert2";
import ButtonSubmit from "./ButtonSubmit.vue";
import Multiselect from "@vueform/multiselect";
import { flashMessage } from "../functions.js";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
</script>

<template>
  <div class="body-container">
    <Header class="header" label="Admin Dashboard"></Header>
    <form @submit.prevent="handleSubmit">
      <div class="main-div">
        <label style="color: #ccc" for="organization"
          ><DescriptionInline label="Your organization"
        /></label>
        <p id="organization">{{ org_id }}</p>

        <label style="color: #ccc" for="selectSubOrganization"
          ><DescriptionInline label="Select sub-organization "
        /></label>
        <select
          class="input"
          id="selectSubOrganization"
          name="sub_organization"
          v-model="survey.suborg_id"
          @change="clearData"
        >
          <option selected :value="null">Select sub-organization</option>
          <option
            v-for="suborg in filteredSubOrg"
            v-bind:key="suborg.suborg_id"
            v-bind:value="suborg.suborg_id"
          >
            {{ suborg.suborg_name }}
          </option>
        </select>

        <label style="color: #ccc" for="selectProgram"
          ><DescriptionInline label="Select program "
        /></label>
        <select
          class="input"
          id="selectProgram"
          name="program"
          v-model="survey.program_id"
          @change="clearData"
        >
          <option selected :value="null">Select program</option>
          <option
            v-for="program in filteredProgram"
            v-bind:key="program.program_id"
            v-bind:value="program.program_id"
          >
            {{ program.program_name }}
          </option>
        </select>

        <label style="color: #ccc" for="selectIteration"
          ><DescriptionInline label="Select iteration "
        /></label>
        <select
          class="input"
          id="selectIteration"
          name="iteration"
          v-model="survey.iteration_id"
          @change="clearData"
        >
          <option selected :value="null">Select iteration</option>
          <option
            v-for="iteration in filteredIteration"
            v-bind:key="iteration.iteration_id"
            v-bind:value="iteration.iteration_id"
          >
            {{ iteration.iteration_name }}
          </option>
        </select>

        <label style="color: #ccc" for="selectStream"
          ><DescriptionInline label="Select stream "
        /></label>
        <select
          class="input"
          id="selectStream"
          name="stream"
          v-model="survey.stream_id"
          @change="clearData"
        >
          <option selected :value="null">Select stream</option>
          <option
            v-for="stream in filteredStream"
            v-bind:key="stream.stream_id"
            v-bind:value="stream.stream_id"
          >
            {{ stream.stream_name }}
          </option>
        </select>

        <label style="color: #ccc" for="selectTemplate"
          ><DescriptionInline label="Select survey template "
        /></label>
        <select
          class="input"
          id="selectTemplate"
          name="template"
          v-model="template_id"
          @change="
            showSurveyType();
            clearData();
          "
        >
          <option selected :value="null">Select survey template</option>
          <option
            v-for="template in filteredSurveyTemplate"
            v-bind:key="template.survey_template_id"
            v-bind:value="template.survey_template_id"
          >
            {{ template.survey_template_name }}
          </option>
        </select>

        <br />
        <br />
        <ButtonSubmit
          class="search-btn"
          label="Search"
          @click.prevent="searchResult"
        />
        <br />
        <br />

        <div class="boxStatistics" style="padding: 0 10px 0 10px; width: 10%">
          <div>
            <p style="color: #f47820"><strong>Statistics</strong></p>
            <clip-loader
              v-if="survey.iteration_id != null"
              :loading="setLoading"
              :color="setColor"
              :size="setSize"
            ></clip-loader>
            <div v-for="stat in statisticsData" :key="stat">
              <div v-if="setLoading == false && survey.iteration_id != null">
                <label class="statistics-label"
                  >Participants: {{ stat.participants_count }}</label
                >
                <br />
                <label class="statistics-label"
                  >Participants registered:
                  {{ stat.participants_registered }} ({{
                    participantsRegisteredPercentage.toFixed(1)
                  }}%)</label
                ><br />
                <label class="statistics-label"
                  >Participants submitted: {{ stat.participants_submitted }} ({{
                    participantsSubmittedPercentage.toFixed(1)
                  }}%)</label
                ><br />
                <label class="statistics-label"
                  >Participants eligible for report:
                  {{ stat.participants_eligible }} ({{
                    participantsEligiblePercentage.toFixed(1)
                  }}%)</label
                ><br />
                <label class="statistics-label"
                  >Total nominees: {{ stat.nominees_count }} ({{
                    totalNomineesPercentage.toFixed(1)
                  }}
                  per participant)</label
                ><br />
                <label class="statistics-label"
                  >Total nominees submitted: {{ stat.nominees_submitted }} ({{
                    totalNomineesSubmittedPercentage.toFixed(1)
                  }}
                  per participant)</label
                ><br />
              </div>
            </div>
          </div>
          <br />
        </div>
        <br />
        <br />
        <div
          class="boxReports"
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-wrap: wrap;
          "
        >
          <div class="label-div">
            <div>
              <strong>Status definitions</strong>
            </div>
            <button
              class="label-btn"
              @click.prevent="toggle2 = !toggle2"
              v-show="!toggle2"
            >
              Show
            </button>
            <button
              class="label-btn"
              @click.prevent="toggle2 = !toggle2"
              v-show="toggle2"
            >
              Hide
            </button>
          </div>
          <div class="box-div" v-show="toggle2" style="padding: 0 10px 0 10px">
            <br />
            <div>
              <FieldNameInline label="Not yet launched: "></FieldNameInline>
              <span
                >The assessment is in the system but has not been made available
                to the participant yet.</span
              >
              <br />
              <FieldNameInline label="Ready to start: "></FieldNameInline>
              <span
                >The assessment is available for the participant to begin.</span
              >
              <br />
              <FieldNameInline label="Started: "></FieldNameInline>
              <span>The participant has started the assessment.</span>
              <br />
              <FieldNameInline label="Open (submitted): "></FieldNameInline>
              <span
                >The assessment deadline has not been reached, but the
                individual has submitted the survey.</span
              >
              <br />
              <FieldNameInline label="Closed (submitted): "></FieldNameInline>
              <span
                >The assessment deadline has been reached, and the participant
                completed and submitted it.</span
              >
              <br />
              <FieldNameInline label="Closed (unsubmitted): "></FieldNameInline>
              <span
                >The assessment deadline has been reached, but the participant
                did not complete and submit it.</span
              >
              <br />
              <FieldNameInline label="Report available: "></FieldNameInline>
              <span
                >The final assessment report is available for both the
                participant and the coach (provided the participant has opted to
                share with the coach).</span
              >
              <br />
              <FieldNameInline
                label="Report available for participant: "
              ></FieldNameInline>
              <span
                >The final assessment report is available for the participant
                only.</span
              >
              <br />
              <FieldNameInline
                label="Report available for coach: "
              ></FieldNameInline>
              <span
                >The final assessment report is available for the coach
                only(provided the participant has opted to share with the
                coach).</span
              >
              <br />
              <FieldNameInline label="Report expired: "></FieldNameInline>
              <span
                >The assessment report is no longer available to the participant
                or the coach.</span
              >
              <br />
              <FieldNameInline label="Dropped: "></FieldNameInline>
              <span>The participant dropped the program.</span>
              <br />
              <!-- <FieldNameInline label="Undropped: "></FieldNameInline>
              <span
                >The participant who previously dropped the program and
                iteration, decided to re-enrol in the program and be included in
                this iteration.</span
              >
              <br /> -->
              <FieldNameInline
                label="Check survey assignment dates: "
              ></FieldNameInline>
              <span
                >A "catch all" description indicating unknown status not meeting
                any of the other status listed here.</span
              >
              <br />
              <br />
            </div>
          </div>
        </div>
        <br />
        <clip-loader
          :loading="setLoading"
          :color="setColor"
          :size="setSize"
        ></clip-loader>
        <div class="table2-container" v-if="secondFetchUserData.length > 0">
          <table id="table2">
            <tr>
              <th style="width: 1%">
                <input
                  type="checkbox"
                  name="tableCheckBox"
                  v-model="allSelected"
                  @change="secondSelectAll"
                  style="cursor: pointer"
                />
              </th>
              <th style="text-align: right; width: 1%">#</th>
              <th v-for="head in table2_headers" :key="head">
                <a
                  @click="sort(head)"
                  :class="{ active: sortBy == head }"
                  style="display: flex; flex-direction: row; cursor: pointer"
                >
                  {{
                    head == "full_name"
                      ? "Full Name"
                      : head == "logged_in"
                      ? "Logged In"
                      : head == "survey_template_name"
                      ? "Template"
                      : head == "launch_date"
                      ? "Launch"
                      : head == "survey_reminder_date"
                      ? "Deadline reminder"
                      : head == "initial_deadline_date"
                      ? "Deadline"
                      : head == "final_deadline_date"
                      ? "Final deadline"
                      : head == "coach_report_start_date"
                      ? "Coach report"
                      : head == "participant_report_start_date"
                      ? "User report"
                      : head == "stream_name"
                      ? "Stream"
                      : head == "group_name"
                      ? "Group"
                      : head == "coach_email"
                      ? "Coach"
                      : head == "coach_access_granted"
                      ? "Coach access granted"
                      : head == "coach_group_access_granted"
                      ? "Coaching group access granted"
                      : head == "hr_access_granted"
                      ? "HR access granted"
                      : head == "STATUS"
                      ? `Status (Based on iteration)`
                      : head == "nominations_submitted"
                      ? "Nominations submitted"
                      : head == "no_of_psup"
                      ? "Supervisor submitted"
                      : head
                  }}
                  <div class="sort-icon" v-if="sortBy == head">
                    <a v-if="sortDirection == 1"
                      ><i class="fa-solid fa-sort-up"></i
                    ></a>
                    <a v-else><i class="fa-solid fa-sort-down"></i></a>
                  </div>
                </a>
              </th>
            </tr>
            <tr
              v-for="(data, index) in table2SortedProperties"
              :key="data.survey_assignment_id"
              :value="data.survey_assignment_id"
              v-memo="[selected]"
            >
              <td class="td-checkbox">
                <input
                  type="checkbox"
                  :value="data.survey_assignment_id"
                  v-model="selected"
                  style="cursor: pointer"
                  number
                />
              </td>
              <td style="text-align: right">{{ incrementIndex(index) }}</td>
              <td>
                {{ data.full_name }}
              </td>
              <td>
                {{ data.logged_in }}
                <a v-if="data.logged_in == 'Yes'"
                  ><i class="fa-solid fa-star"></i
                ></a>
                <a v-else
                  ><i class="fas fa-info-circle icon-background1"></i
                ></a>
              </td>
              <td v-for="head in table2_headers_data" :key="head">
                {{
                  head == "survey_template_name"
                    ? data[head]
                    : head == "stream_name"
                    ? data[head]
                    : head == "group_name"
                    ? data[head]
                    : head == "coach_email"
                    ? data[head]
                    : head == "coach_access_granted"
                    ? data[head]
                    : head == "coach_group_access_granted"
                    ? data[head]
                    : readDate(data[head])
                }}
              </td>
              <td>{{ data.hr_access_granted }}</td>
              <td>
                {{ data.STATUS }}
                <a
                  v-if="
                    data.STATUS != 'Closed (unsubmitted)' &&
                    data.STATUS != 'Not yet launched' &&
                    data.STATUS != 'Dropped' &&
                    data.STATUS != 'Report expired' &&
                    data.STATUS != 'Check survey assignment dates'
                  "
                  ><i class="fa-solid fa-star"></i
                ></a>
                <a v-else
                  ><i class="fas fa-info-circle icon-background1"></i
                ></a>
              </td>
              <td>
                {{ data.nominations_submitted }}
                <a
                  v-if="
                    data.nominations_submitted != `${0}/${0}` &&
                    data.nominations_submitted != `${0}/${1}` &&
                    data.nominations_submitted != `${0}/${2}` &&
                    data.nominations_submitted != `${0}/${3}` &&
                    data.nominations_submitted != `${0}/${4}` &&
                    data.nominations_submitted != `${0}/${5}` &&
                    data.nominations_submitted != `${0}/${6}` &&
                    data.nominations_submitted != `${0}/${7}` &&
                    data.nominations_submitted != `${0}/${8}` &&
                    data.nominations_submitted != `${0}/${9}` &&
                    data.nominations_submitted != `${0}/${10}` &&
                    data.nominations_submitted != `${0}/${11}` &&
                    data.nominations_submitted != `${0}/${12}` &&
                    data.nominations_submitted != `${0}/${13}` &&
                    data.nominations_submitted != `${0}/${14}` &&
                    data.nominations_submitted != `${0}/${15}` &&
                    data.nominations_submitted != `${0}/${16}` &&
                    data.nominations_submitted != `${0}/${17}` &&
                    data.nominations_submitted != `${0}/${18}` &&
                    data.nominations_submitted != `${0}/${19}` &&
                    data.nominations_submitted != `${0}/${20}`
                  "
                  ><i class="fa-solid fa-star"></i
                ></a>
                <a v-else
                  ><i class="fas fa-info-circle icon-background1"></i
                ></a>
              </td>
              <td>{{ data.no_of_psup }}</td>
            </tr>
          </table>
          <!-- {{ selected.join(", ") }} -->
        </div>
        <br />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "AdminDashboardClientAdminViewer",
  component: [
    DescriptionInline,
    DropDownInfo,
    DropDownInfoNumbered,
    HeaderReport,
    FieldNameInline,
    ButtonSubmit,
    Multiselect,
    ClipLoader,
    Header,
  ],
  props: ["buttonLabel", "userData", "brandData"],

  data: () => ({
    setColor: "#ff6a00",
    setSize: "50px",
    showIndividualRecords: true,
    toggle2: false,
    toggle: false,
    setLoading: false,
    surveyType: "",
    statisticsData: [],
    participantsRegisteredPercentage: "",
    participantsSubmittedPercentage: "",
    participantsEligiblePercentage: "",
    totalNomineesPercentage: "",
    totalNomineesSubmittedPercentage: "",
    table_headers: [
      "NAME",
      "program_name",
      "iteration_name",
      "stream_name",
      "group_name",
    ],
    table2_headers: [
      "full_name",
      "logged_in",
      "survey_template_name",
      "launch_date",
      "survey_reminder_date",
      "initial_deadline_date",
      "final_deadline_date",
      "coach_report_start_date",
      "participant_report_start_date",
      "stream_name",
      "group_name",
      "coach_email",
      "coach_access_granted",
      "coach_group_access_granted",
      "hr_access_granted",
      "STATUS",
      "nominations_submitted",
      "no_of_psup",
    ],
    table2_headers_data: [
      "survey_template_name",
      "launch_date",
      "survey_reminder_date",
      "initial_deadline_date",
      "final_deadline_date",
      "coach_report_start_date",
      "participant_report_start_date",
      "stream_name",
      "group_name",
      "coach_email",
      "coach_access_granted",
      "coach_group_access_granted",
    ],
    show_nomination_modal: false,
    show_nominee_modal: false,
    surveyAssignmentId: "",
    nominee_ind_id: "",
    nominee_survey_assignment_id: "",
    sortDirection: 1,
    sortBy: "",
    allSelected: false,
    org_id: "",
    coach_email_inp: null,
    suborg_inp: null,
    program_inp: null,
    program_id: null,
    iteration_id: null,
    iteration_inp: null,
    stream_id: null,
    stream_inp: null,
    group_inp: null,
    template_id: null,
    actions: null,
    surveyTemplate: null,
    selected: [],
    firstFetchUserData: [],
    secondFetchUserData: [],
    userOrg: [],
    userSubOrg: [],
    userPrograms: [],
    coachUsers: [],
    userIterations: [],
    userStreams: [],
    userGroups: [],
    userSurveyTemplate: [],
    batchActions: [],
    batchActions2: [],
    filteredData: [],
    newNameSuborg: [],
    nomineeSurveyTemplateId: 0,
    dates: {
      launch: "",
      reminder: "",
      initial_deadline: "",
      coach_report_start: "",
      coach_report_end: "",
      deadline_final: "",
      participant_report_start: "",
      modified_by: "",
    },
    survey: {
      org_id: "",
      suborg_id: null,
      survey_template_id: null,
      survey_template_association_id: "",
      is_test: "",
      for_sample_report: "",
      program_id: null,
      iteration_id: null,
      stream_id: null,
      group_id: null,
      action_program_id: null,
      action_iteration_id: null,
      action_stream_id: null,
      // action_group_id: null,
      start: "",
      launch: "",
      reminder: "",
      deadline_initial: "",
      deadline_final: "",
      coach_report_start: "",
      coach_report_end: "",
      participant_report_start: "",
      recommended_number_of_nominations: "",
      max_number_of_nominations: "",
      report_eligible_number_of_respondents: "",
      created_by: 1,
      modified_by: 1,
    },
  }),
  async mounted() {
    await this.renderData();

    var splitUserSuborg = this.userData.suborgs.split(",");
    var joinedUserSuborg = splitUserSuborg.join(",");

    api
      .get(`/multiple-sub-organizations-by-suborg/${joinedUserSuborg}`)
      .then((res) => {
        this.userSubOrg = res.data;
      });

    await api.get("individuals/" + this.userData.ind_id).then((result) => {
      this.org_id = result.data.org_name;
    });

    await api.get("survey-templates-survey_template_name").then((result) => {
      this.userSurveyTemplate = result.data;
    });
  },
  methods: {
    async sort(head) {
      const sorted = `Sorted ${
        head == "NAME"
          ? "Name"
          : head == "program_name"
          ? "Program"
          : head == "iteration_name"
          ? "Iteration"
          : head == "full_name"
          ? "Full Name"
          : head == "logged_in"
          ? "Logged In"
          : head == "survey_template_name"
          ? "Template"
          : head == "tag_names"
          ? "Tags"
          : head == "launch_date"
          ? "Launch"
          : head == "survey_reminder_date"
          ? "Deadline reminder"
          : head == "initial_deadline_date"
          ? "Deadline"
          : head == "final_deadline_date"
          ? "Final deadline"
          : head == "coach_report_start_date"
          ? "Coach report"
          : head == "participant_report_start_date"
          ? "User report"
          : head == "stream_name"
          ? "Stream"
          : head == "group_name"
          ? "Group"
          : head == "coach_email"
          ? "Coach"
          : head == "coach_access_granted"
          ? "Coach access granted"
          : head == "coach_group_access_granted"
          ? "Coaching group access granted"
          : head == "STATUS"
          ? "Status"
          : head == "nominations_submitted"
          ? "Nominations submitted"
          : head
      } column successfully.`;
      this.sortBy = head;
      this.sortDirection *= -1;

      if (head == "" && head == undefined) {
        this.searchResult();
      } else {
        this.searchResult(sorted);
      }
    },

    async renderData() {
      await api.get("sub-organizations/").then((result) => {
        this.userSubOrg = result.data;
      });

      await api.get("programs").then((result) => {
        this.userPrograms = result.data;
      });

      await api.get("iterations").then((result) => {
        this.userIterations = result.data;
      });

      await api.get("streams").then((result) => {
        this.userStreams = result.data;
      });

      await api.get("groups").then((result) => {
        this.userGroups = result.data;
      });
    },

    clearData() {
      this.firstFetchUserData = [];
      this.secondFetchUserData = [];
      this.selected = [];
      this.allSelected = false;
      this.toggle = false;
      this.actions = null;
      this.surveyTemplate = null;
      this.sortBy = "";
      this.survey.action_program_id = null;
      this.survey.action_iteration_id = null;
      this.survey.action_stream_id = null;
      this.survey.group_id = null;
      this.survey.survey_template_id = null;
      this.suborg_inp = null;
      this.program_inp = null;
      this.iteration_inp = null;
      this.stream_inp = null;
      this.group_inp = null;
      this.coach_email_inp = null;
      this.dates.deadline_final = "";
      this.dates.launch = "";
      this.dates.reminder = "";
      this.dates.coach_report_start = "";
      this.dates.coach_report_end = "";
      this.dates.participant_report_start = "";
      this.dates.initial_deadline = "";
      this.statisticsData = [];
      this.participantsRegisteredPercentage = "";
      this.participantsSubmittedPercentage = "";
      this.participantsEligiblePercentage = "";
      this.totalNomineesPercentage = "";
      this.totalNomineesSubmittedPercentage = "";
      this.nomineeSurveyTemplateId = 0;
    },

    dynamicSort(property, direction) {
      if (property[0] === "-") {
        property = property.substr(1);
      }
      return function (a, b) {
        var result =
          a[property] < b[property] ? 1 : a[property] > b[property] ? -1 : 0;
        // console.log(result)
        if (a[property] === "" || a[property] === null) return 1;
        if (b[property] === "" || b[property] === null) return -1;
        if (a[property] === b[property]) return 0;
        return result * direction;
        // console.log(result * direction);
        // return result * direction;
      };
    },
    async searchResult(sorted) {
      this.setLoading = true;
      this.firstFetchUserData = [];
      this.secondFetchUserData = [];
      this.selected = [];
      this.allSelected = false;

      if (this.survey.iteration_id != null && this.template_id != null) {
        await api
          .get(
            `/survey-assignments/statistics-by-iterationAndTemplate/${this.survey.iteration_id}/${this.template_id}/${this.nomineeSurveyTemplateId}`
          )
          .then((res) => {
            console.log(res.data);
            this.statisticsData = res.data;
            res.data.map((stat) => {
              this.participantsRegisteredPercentage =
                (stat.participants_registered / stat.participants_count) * 100;
              this.participantsSubmittedPercentage =
                (stat.participants_submitted / stat.participants_count) * 100;
              this.participantsEligiblePercentage =
                (stat.participants_eligible / stat.participants_count) * 100;
              this.totalNomineesPercentage =
                stat.nominees_count / stat.participants_count;
              this.totalNomineesSubmittedPercentage =
                stat.nominees_submitted / stat.participants_count;
            });
          });
      } else if (this.survey.iteration_id != null && this.template_id == null) {
        await api
          .get(
            `/survey-assignments/statistics-by-iteration/${this.survey.iteration_id}`
          )
          .then((res) => {
            console.log(res.data);
            this.statisticsData = res.data;
            res.data.map((stat) => {
              this.participantsRegisteredPercentage =
                (stat.participants_registered / stat.participants_count) * 100;
              this.participantsSubmittedPercentage =
                (stat.participants_submitted / stat.participants_count) * 100;
              this.participantsEligiblePercentage =
                (stat.participants_eligible / stat.participants_count) * 100;
              this.totalNomineesPercentage =
                stat.nominees_count / stat.participants_count;
              this.totalNomineesSubmittedPercentage =
                stat.nominees_submitted / stat.participants_count;
            });
          });
      }

      if (
        this.survey.suborg_id == null &&
        this.survey.program_id == null &&
        this.survey.iteration_id == null &&
        this.survey.stream_id == null
      ) {
        await api
          .get(
            `survey-assignments-client-admin-dashboard/org/${this.userData.org_id}`
          )
          .then((res) => {
            this.secondFetchUserData = res.data;
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color
                ? this.brandData.flash_text_color
                : "#ffffff",
              sorted == undefined
                ? this.secondFetchUserData.length + " result(s) found."
                : sorted.toString().includes("successfully")
                ? sorted
                : this.secondFetchUserData.length + " result(s) found."
            );
          })
          .catch((e) => {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color
                ? this.brandData.flash_text_color
                : "#ffffff",
              e.message
            );
          });
      } else if (
        this.survey.suborg_id != null &&
        this.survey.program_id == null &&
        this.survey.iteration_id == null &&
        this.survey.stream_id == null
      ) {
        if (this.template_id == null) {
          await api
            .get(
              `survey-assignments-client/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}`
            )
            .then((res) => {
              this.secondFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.secondFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.secondFetchUserData.length + " result(s) found."
              );
            })
            .catch((e) => {
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                e.message
              );
            });
        } else {
          api
            .get(
              `survey-assignments-client-survey-template/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/template/${this.template_id}`
            )

            .then((res) => {
              this.secondFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.secondFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.secondFetchUserData.length + " result(s) found."
              );
            })
            .catch((e) => {
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                e.message
              );
            });
        }
      } else if (
        this.survey.suborg_id != null &&
        this.survey.program_id != null &&
        this.survey.iteration_id == null &&
        this.survey.stream_id == null
      ) {
        if (this.template_id == null) {
          await api
            .get(
              `survey-assignments-client/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}`
            )
            .then((res) => {
              this.secondFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.secondFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.secondFetchUserData.length + " result(s) found."
              );
            })
            .catch((e) => {
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                e.message
              );
            });
        } else {
          await api
            .get(
              `survey-assignments-client-survey-template/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/template/${this.template_id}`
            )
            .then((res) => {
              this.secondFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.secondFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.secondFetchUserData.length + " result(s) found."
              );
            })
            .catch((e) => {
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                e.message
              );
            });
        }
      } else if (
        this.survey.suborg_id != null &&
        this.survey.program_id != null &&
        this.survey.iteration_id != null &&
        this.survey.stream_id == null
      ) {
        if (this.template_id == null) {
          await api
            .get(
              `survey-assignments-client/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}`
            )
            .then((res) => {
              console.log(res.data);
              this.secondFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.secondFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.secondFetchUserData.length + " result(s) found."
              );
            })
            .catch((e) => {
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                e.message
              );
            });
        } else {
          await api
            .get(
              `survey-assignments-client-survey-template/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}/template/${this.template_id}`
            )
            .then((res) => {
              this.secondFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.secondFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : sorted.toString().includes("iteration")
                  ? "Iteration run successful"
                  : this.secondFetchUserData.length + " result(s) found."
              );
            })
            .catch((e) => {
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                e.message
              );
            });
        }
      } else if (
        this.survey.suborg_id != null &&
        this.survey.program_id != null &&
        this.survey.iteration_id != null &&
        this.survey.stream_id != null
      ) {
        if (this.template_id == null) {
          await api
            .get(
              `survey-assignments-client/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}/stream/${this.survey.stream_id}`
            )
            .then((res) => {
              this.secondFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.secondFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.secondFetchUserData.length + " result(s) found."
              );
            })
            .catch((e) => {
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                e.message
              );
            });
        } else {
          await api
            .get(
              `survey-assignments-client-survey-template/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}/stream/${this.survey.stream_id}/template/${this.template_id}`
            )
            .then((res) => {
              this.secondFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.secondFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.secondFetchUserData.length + " result(s) found."
              );
            })
            .catch((e) => {
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                e.message
              );
            });
        }
      }
      this.toggle = false;
      this.actions = null;
      this.survey.survey_template_id = null;
      this.setLoading = false;
    },

    incrementIndex(index) {
      return index + 1;
    },

    readDate(data) {
      var parsedDate = Date.parse(data);

      if (isNaN(data) && !isNaN(parsedDate)) {
        const humanReadableDateTime = new Date(data).toLocaleString();
        return humanReadableDateTime;
      } else {
        return data;
      }
    },
  },
  computed: {
    filteredSubOrg: function () {
      return this.userSubOrg.sort((a, b) =>
        a.suborg_name.localeCompare(b.suborg_name)
      );
    },

    filteredProgram: function () {
      return this.userPrograms
        .sort((a, b) => a.program_name.localeCompare(b.program_name))
        .filter(function (el) {
          if (this.userData.org_id != "") {
            return (
              el.org_id == this.userData.org_id &&
              el.suborg_id == this.survey.suborg_id
            );
          }
        }, this);
    },

    filteredIteration: function () {
      return this.userIterations
        .sort((a, b) => a.iteration_name.localeCompare(b.iteration_name))
        .filter(function (el) {
          if (this.userData.org_id != "") {
            return (
              el.org_id == this.userData.org_id &&
              el.suborg_id == this.survey.suborg_id &&
              el.program_id == this.survey.program_id
            );
          }
        }, this);
    },

    filteredStream: function () {
      return this.userStreams
        .sort((a, b) => a.stream_name.localeCompare(b.stream_name))
        .filter(function (el) {
          if (this.userData.org_id != "") {
            return (
              el.org_id == this.userData.org_id &&
              el.suborg_id == this.survey.suborg_id &&
              el.program_id == this.survey.program_id &&
              el.iteration_id == this.survey.iteration_id
            );
          }
        }, this);
    },

    filteredSurveyTemplate: function () {
      return this.userSurveyTemplate
        .sort((a, b) =>
          a.survey_template_name.localeCompare(b.survey_template_name)
        )
        .filter(function (el) {
          if (this.userData.org_id != "") {
            return (
              el.nominee_survey_template_id != null &&
              el.org_id == this.userData.org_id &&
              el.suborg_id == this.survey.suborg_id
            );
          }
        }, this);
    },

    table2SortedProperties() {
      const direction = this.sortDirection;
      const head = this.sortBy;
      return this.secondFetchUserData.sort(this.dynamicSort(head, direction));
    },
  },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style scoped>
.icon-background1 {
  color: red;
  /* background-color: black; */
}
.fa-star {
  color: green;
}

.label-btn {
  color: #fff;
  background-color: #0e5071;
}

.label-div {
  padding: 10px;
  border: 1px solid #0e5071;
  background-color: #0e5071;
  color: #fff;
  display: flex;
  justify-content: space-between;
}
#batchAction {
  height: 10%;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-wrap: break-word;
  border-color: grey;
  margin: 30px 0px;
}

.input {
  width: 100%;
  outline: 0;
  border-width: 0 0 1px;
  border-color: grey;
  padding: 2px 5px;
  margin: 10px 0px;
  font-family: Arial, Helvetica, sans-serif;
}

.box {
  border: 1px solid #ccc;
  border-top: 4px solid rgb(185, 22, 10);
  text-align: center;
  font: -webkit-control;
  margin: 0 10px;
  min-height: 400px;
  padding: 10px;
  max-width: 250px;
  min-height: 620px;
}

.boxReports {
  border: 1px solid #ccc;
  /* border-top: 4px solid rgb(185, 22, 10); */
  text-align: left;
  font: -webkit-control;
  margin: 0 10px;
  min-height: 10px;
  max-width: 100%;
  min-width: 75vw;
}

.boxStatistics {
  border: 1px solid #ccc;
  /* border-top: 4px solid rgb(185, 22, 10); */
  text-align: left;
  font: -webkit-control;
  margin: 0 10px;
  min-height: 10vh;
  max-width: 100%;
  min-width: 37.5vw;
}

.label1 {
  top: 0px;
  left: 0px;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.54);
  font-family: Arial, Helvetica, sans-serif;
}

#table2 {
  width: 100%;
  /* table-layout: fixed; */
  border-collapse: collapse;
}

#table2 td,
#table2 th {
  border: 1px solid #ddd;
  padding: 6px;
  height: auto;
}

#table2 tr:nth-child(even) {
  background-color: #f2f2f2;
}

#table2 tr:hover {
  background-color: #ddd;
}

#table2 th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #0e5071;
  color: white;
  word-break: word-wrap;
  font-size: 0.8vw;
}

#table2 td {
  text-align: left;
  vertical-align: middle;
  word-break: word-wrap;
  font-size: 0.7vw;
}

.td-checkbox {
  text-align: center !important;
}

.active {
  color: #f47820;
}

.statistics-label {
  margin: 0;
}

.search-btn {
  width: 20%;
}

.main-div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
}

.actions-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-content: center;
  margin-top: 30px;
}

.body-container {
  background: white;
  margin: 20px;
  padding: 40px;
  box-shadow: 0px 2px 10px -4px #000000;
  border-radius: 20px;
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header {
  display: flex;
  justify-content: left;
  align-self: flex-start;
}

@media only screen and (min-width: 280px) and (max-width: 900px) {
  .header {
    font-size: 4vw;
    width: 98%;
    background: white;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    position: relative;
    align-items: center;
  }
  .body-container {
    font-size: 2.5vw;
    padding: 10px;
    margin: 10px;
    background: white;
    box-shadow: 0px 2px 10px -4px #000000;
    border-radius: 20px;
    align-self: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .main-div {
    font-size: 2.5vw;
    background: white;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    position: relative;
    align-items: center;
  }

  .search-btn {
    width: 20%;
  }
  #batchAction {
    height: 10%;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-wrap: break-word;
    border-color: grey;
    margin: 30px 0px;
    font-size: 1.5vw;
  }

  .input {
    width: 80%;
    outline: 0;
    border-width: 0 0 1px;
    border-color: grey;
    padding: 2px 5px;
    margin: 10px 0px;
    font-family: Arial, Helvetica, sans-serif;
  }
  .multiselect {
    font-size: 1.5vw;
  }

  .batch-action-input2 {
    font-size: 1.5vw;
  }
  .input1 {
    font-size: 1.5vw;
  }

  #table2 {
    font-size: 2vw;
    border-collapse: collapse;
    word-break: break-word;
  }

  .table2-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    position: relative;
    align-items: center;
  }

  .actions-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-content: center;
    margin-top: 30px;
    width: 100%;
    font-size: 1vw;
  }
  .batch-action-input {
    width: 20%;
    outline: 0;
    border-color: grey;
    padding: 2px 5px;
    margin: 10px 0px;
  }

  #selectBatchAction[data-v-119a4ef4] {
    font-size: 1.5vw;
  }
  .batch-action-desc {
    font-size: 1.5vw;
  }
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
