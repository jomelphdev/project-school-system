<script setup>
import api from "../api/api";
import DescriptionInline from "./DescriptionInline.vue";
import { flashMessage } from "../functions.js";
import ButtonSubmit from "./ButtonSubmit.vue";
import Multiselect from "@vueform/multiselect";
</script>

<template>

    <div>
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
<!-- 
          <label style="color: #ccc" for="selectTemplate"
            ><DescriptionInline label="Select survey template "
          /></label>
          <select
            class="input"
            id="selectTemplate"
            name="template"
            v-model="template_id"
            @change="clearData"
          >
            <option selected :value="null">Select survey template</option>
            <option
              v-for="template in filteredSurveyTemplate"
              v-bind:key="template.survey_template_id"
              v-bind:value="template.survey_template_id"
            >
              {{ template.survey_template_name }} - {{ template.survey_file }}
            </option>
          </select> -->

          <br />
          <!-- <div style="display: flex">
            <input
              type="checkbox"
              v-model="showParticipantReports"
              @change="clearData"
            />
            <label style="margin: 0 0 0 2px"
              >Show participant reports.</label
            >
          </div> -->
          <div style="display: flex">
            <input
              type="checkbox"
              v-model="showCoachReports"
              @change="clearData"
            />
            <label style="margin: 0 0 0 2px"
              >Show request history.</label
            >
          </div>
          <br />
          <ButtonSubmit
            class="search-btn"
            label="Search"
            @click.prevent="searchResult"
          />
          <br/>


        <div class="survey-assignment-table-container">
          <table id="survey-assignment-table">

          </table>
        </div>

        <div class="report-assignment-table-container">
          <table id="report-assignment-table">

          </table>
        </div>

        <div class="actions-container">

        </div>

        </div>
      </form>
    </div>

</template>

<script>
export default {
  component: [DescriptionInline, ButtonSubmit, Multiselect],
  name: "ReportSchedulerBox",
  props: ["userData", "brandData"],
  data: () => ({
    org_id: "",
    template_id: null,
    userOrg: [],
    userSubOrg: [],
    userPrograms: [],
    coachUsers: [],
    userIterations: [],
    userStreams: [],
    userGroups: [],
    userSurveyTemplate: [],
    showParticipantReports: false,
    showCoachReports: false,
    survey: {
      org_id: "",
      suborg_id: null,
      survey_template_id: null,
      survey_template_association_id: "",
      program_id: null,
      iteration_id: null,
      stream_id: null,
      group_id: null,
      action_program_id: null,
      action_iteration_id: null,
      action_stream_id: null,
      action_tag: null,
      created_by: 1,
      modified_by: 1,
    },
    reportsOptions: [
    '5 Step Profile Coach Report', 
    'TIPping Point Coach Report', 
    'Pressure Point Coach Report',
    ],
  }),
  async mounted() {
    this.survey.org_id = this.userData.org_id;

    await api.get("individuals/" + this.userData.ind_id).then((result) => {
      this.org_id = result.data.org_name;
    });

    await api.get("survey-templates-survey_template_name").then((result) => {
      this.userSurveyTemplate = result.data;
    });

    await this.renderData();
  },
  methods: {
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
            // console.log(res.data);
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
            // console.log(res.data);
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

      if (this.survey.iteration_id !== null) {
        await api
          .get(`/iteration-log/${this.survey.iteration_id}`)
          .then((result) => {
            this.iterationLogTableRows = result.data;
          });
      }

      if (this.showIndividualRecords == true) {
        if (
          this.survey.suborg_id == null &&
          this.survey.program_id == null &&
          this.survey.iteration_id == null
        ) {
          await api
            .get(`individuals/ind_group/org/${this.userData.org_id}`)
            .then((res) => {
              this.firstFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.firstFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.firstFetchUserData.length + " result(s) found."
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
          this.survey.program_id == null &&
          this.survey.iteration_id == null
        ) {
          await api
            .get(
              `individuals/ind_group/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/`
            )
            .then((res) => {
              this.firstFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.firstFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.firstFetchUserData.length + " result(s) found."
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
          this.survey.iteration_id == null &&
          this.survey.stream_id == null
        ) {
          await api
            .get(
              `individuals/ind_group/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}`
            )
            .then((res) => {
              this.firstFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.firstFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.firstFetchUserData.length + " result(s) found."
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
        } else if (this.survey.stream_id == null) {
          await api
            .get(
              `individuals/ind_group/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}`
            )
            .then((res) => {
              this.firstFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.firstFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.firstFetchUserData.length + " result(s) found."
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
              `individuals/ind_group/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}/stream/${this.survey.stream_id}`
            )
            .then((res) => {
              this.firstFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.firstFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.firstFetchUserData.length + " result(s) found."
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
      } else {
        if (
          this.survey.suborg_id == null &&
          this.survey.program_id == null &&
          this.survey.iteration_id == null &&
          this.survey.stream_id == null
        ) {
          await api
            .get(
              `survey-assignments-admin-dashboard/org/${this.userData.org_id}`
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
                `survey-assignments/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}`
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
                `survey-assignments-survey-template/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/template/${this.template_id}`
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
                `survey-assignments/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}`
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
                `survey-assignments-survey-template/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/template/${this.template_id}`
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
                `survey-assignments/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}`
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
                `survey-assignments-survey-template/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}/template/${this.template_id}`
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
                `survey-assignments/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}/stream/${this.survey.stream_id}`
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
                `survey-assignments-survey-template/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}/stream/${this.survey.stream_id}/template/${this.template_id}`
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
      }
      this.toggle = false;
      this.actions = null;
      this.survey.survey_template_id = null;
      this.setLoading = false;
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
      this.tags = null;
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
      this.participantsRegisteredPercentage = 0;
      this.participantsSubmittedPercentage = 0;
      this.participantsEligiblePercentage = 0;
      this.totalNomineesPercentage = 0;
      this.totalNomineesSubmittedPercentage = 0;
      this.nomineeSurveyTemplateId = 0;
      this.iterationLogTableRows = null;
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
  },

  computed: {
    filteredSubOrg: function () {
      return this.userSubOrg
        .sort((a, b) => a.suborg_name.localeCompare(b.suborg_name))
        .filter(function (el) {
          if (this.userData.org_id != "") {
            return el.org_id == this.userData.org_id;
          }
        }, this);
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
              el.org_id == this.userData.org_id &&
              el.suborg_id == this.survey.suborg_id
            );
          }
        }, this);
    },
  },
};
</script>


<style scoped>
.main-div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
}

#survey-assignment-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
}

#survey-assignment-table td,
#survey-assignment-table th {
  border: 1px solid #ddd;
  padding: 8px;
  /* word-break: word-wrap; */
}

#survey-assignment-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#survey-assignment-table tr:hover {
  background-color: #ddd;
}

#survey-assignment-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #0e5071;
  color: white;
}

#report-assignment-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
}

#report-assignment-table td,
#report-assignment-table th {
  border: 1px solid #ddd;
  padding: 8px;
  /* word-break: word-wrap; */
}

#report-assignment-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#report-assignment-table tr:hover {
  background-color: #ddd;
}

#report-assignment-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #0e5071;
  color: white;
}

#survey-assignment-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
}

#survey-assignment-table td,
#survey-assignment-table th {
  border: 1px solid #ddd;
  padding: 8px;
  /* word-break: word-wrap; */
}

#survey-assignment-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#survey-assignment-table tr:hover {
  background-color: #ddd;
}

#survey-assignment-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #0e5071;
  color: white;
}

.actions-container {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  align-content: center;
  margin-top: 30px;
}

.batchAction-btn {
  margin-left: 20px;
  width: 20%;
}

#batchAction {
  height: 10%;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-wrap: break-word;
  border-color: grey;
  margin: 30px 0px;
}

#decline-btn{
  height: 10%;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-wrap: break-word;
  border-color: grey;
  background-color: red;
  color: white;
  margin: 30px 0px;
}
.batch-action-input {
  width: 30%;
  outline: 0;
  border-color: grey;
  padding: 2px 5px;
  margin: 10px 0px;
}

.multiselect-input{
  --ms-tag-font-size: 1vw;
  --ms-px: 0.5rem; 
}

.search-btn {
  width: 7vw;
  font-size: 1vw;
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
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>