<script setup>
import api from "../api/api";
import CryptoJS from "crypto-js";
import Multiselect from "@vueform/multiselect";
import Swal from "sweetalert2";
import ButtonSubmit from "./ButtonSubmit.vue";
</script>

<template>
  <div class="body-container">
    <div
      style="
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <div style="width: 50%; height: 80%">
        <h1>Individual Survey</h1>
        <b>Add Survey</b>
        <br />
        <br />
        <br />
        <label for="user">User</label>
        <input
          id="user"
          class="input"
          placeholder="d.c.hallett@gmail.com"
          type="text"
          v-model="user.email"
          disabled
        />

        <label for="org" class="input"
          >Select Organization
          <select class="input" id="org" v-model="survey.org_id" disabled>
            <option v-for="org in orgs" :value="org.org_id" :key="org.org_id">
              {{ org.org_name }}
            </option>
          </select>
        </label>

        <br />

        <label for="sub-org" class="input"
          >Select sub-organization
          <select
            class="input"
            v-model="survey.suborg_id"
            @change="reloadPrograms"
          >
            <option value="0">Select sub-organization</option>
            <option
              v-for="suborg in sortedSuborg"
              :value="suborg.suborg_id"
              :key="suborg.suborg_id"
            >
              {{ suborg.suborg_name }}
            </option>
          </select>
        </label>

        <label for="survey-template" class="input"
          >Select survey template
          <select
            class="input"
            v-model="survey.survey_template_id"
            @change="toPreviewSurvey($event)"
          >
            <option disabled>Select survey template</option>
            <option
              v-for="template in sortedSurveyTemplate"
              :value="template.survey_template_id"
              :key="template.survey_template_id"
            >
              {{ template.survey_template_name }} - {{ template.survey_file }}
            </option>
          </select>
        </label>

        <!--
              <div class="shadowed">
                  <p class="fg-orange">These cannot be changed! Please ensure these are both correct when creating new surveys, to avoid adversely affecting billing and participant reports.</p>
                  <input type="checkbox" name="is_test" v-model="is_test" />Trial/Test
                  <br />
                  <input type="checkbox" name="for_sample_report" v-model="for_sample_report" />For sample report
              </div>
              -->

        <div style="display: flex; flex-direction: row; width: 100%">
          <label for="program" style="width: 50%"
            >Program
            <Multiselect
              id="program"
              v-model="survey.program_id"
              class="input"
              placeholder="Select program"
              :searchable="true"
              :single="true"
              :options="filteredProgram"
              @input="reloadIterations"
              @select="reloadIterations"
            />
          </label>

          <label for="iteration" style="width: 50%"
            >Iteration
            <Multiselect
              id="iteration"
              v-model="survey.iteration_id"
              class="input"
              placeholder="Select iteration"
              :searchable="true"
              :single="true"
              :options="filteredIteration"
              @input="reloadStreams"
              @select="reloadStreams"
            />
          </label>
        </div>
        <br />
        <div style="display: flex; flex-direction: row; width: 100%">
          <label for="stream" style="width: 50%"
            >Stream
            <select
              id="stream"
              style="display: inline-block"
              class="input"
              v-model="survey.stream_id"
              @change="reloadGroups"
            >
              <option
                v-for="stream in sortedStream"
                :key="stream.stream_id"
                :value="stream.stream_id"
              >
                {{ stream.stream_name }}
              </option>
            </select>
          </label>

          <label for="group" style="width: 50%"
            >Group
            <select
              id="group"
              style="display: inline-block"
              class="input"
              v-model="survey.group_id"
            >
              <option
                v-for="group in sortedGroup"
                :key="group.group_id"
                :value="group.group_id"
              >
                {{ group.group_name }}
              </option>
            </select>
          </label>
        </div>
        <br />
        <b>Dates</b>
        <p>
          If you wish for an action to happen as soon as possible, enter a date
          in the past (we recommend going back at least a day to account for
          time zone differences), e.g. entering a launch date of yesterday will
          queue up the survey for launch within the next minute or so.
        </p>

        <label for="launch"><span style="color: #ccc">Launch</span></label
        ><br />
        <input
          class="input"
          type="datetime-local"
          id="launch"
          :value="survey.launch"
          @input="survey.launch = $event.target.value"
        />
        <br />
        <label for="reminder"
          ><span style="color: #ccc">Survey reminder</span></label
        ><br />
        <input
          class="input"
          type="datetime-local"
          id="reminder"
          :value="survey.reminder"
          @input="survey.reminder = $event.target.value"
        />
        <br />
        <label for="deadline_initial"
          ><span style="color: #ccc">Initial deadline</span></label
        ><br />
        <input
          class="input"
          type="datetime-local"
          id="deadline_initial"
          required
          :value="survey.deadline_initial"
          @input="survey.deadline_initial = $event.target.value"
        />
        <br />
        <label for="deadline_final"
          ><span style="color: #ccc">Final deadline</span></label
        ><br />
        <input
          class="input"
          type="datetime-local"
          id="deadline_final"
          required
          :value="survey.deadline_final"
          @input="survey.deadline_final = $event.target.value"
        />
        <br />
        <label for="coach_report_start"
          ><span style="color: #ccc">Coach report start</span></label
        ><br />
        <input
          class="input"
          type="datetime-local"
          id="coach_report_start"
          :value="survey.coach_report_start"
          @input="survey.coach_report_start = $event.target.value"
        />
        <br />
        <label for="coach_report_end"
          ><span style="color: #ccc">Coach report end</span></label
        ><br />
        <input
          class="input"
          type="datetime-local"
          id="coach_report_end"
          :value="survey.coach_report_end"
          @input="survey.coach_report_end = $event.target.value"
        />
        <br />
        <label for="participant_report_start"
          ><span style="color: #ccc">Participant report start</span></label
        ><br />
        <input
          class="input"
          type="datetime-local"
          id="participant_report_start"
          :value="survey.participant_report_start"
          @input="survey.participant_report_start = $event.target.value"
        />
        <br />
        <br />
        <div class="buttonBox">
          <ButtonSubmit label="Save" @click="swalValidation" />
          <ButtonSubmit
            class="survey-preview"
            label="Preview Survey"
            :disabled="!survey.survey_template_id"
            @click="previewSurvey(surveyTemplateLink)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  component: [Multiselect, ButtonSubmit],
  name: "AddSurvey",
  data() {
    return {
      user: {},
      authenticatedUser: {},
      survey: {
        org_id: "",
        suborg_id: "",
        survey_template_id: "",
        survey_template_association_id: "",
        is_test: "",
        for_sample_report: "",
        program_id: [],
        iteration_id: [],
        stream_id: "",
        group_id: "",
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
      },
      suborgs: [],
      orgs: [],
      surveyTemplates: [],
      programs: [],
      iterations: [],
      streams: [],
      groups: [],
      //Send Survey
      selectedUserDetails: [],
      selectedUserSurvey_Assigned_id: 0,
      emailTemplateId: 0,
      subject: "",
      email_body: "",
      tokens: {
        recipient_email: "",
        website_url: "",
        nominee_salutation: "",
        nominee_message: "",
        program_name: "",
        org_name: "",
        suborg_name: "",
        website_sender_email: "",
        website_terms_url: "",
        website_privacy_url: "",
        website_contact_email: "",
        survey_close_date: "",
        days_until_survey_close_date: "",
        survey_template_name: "",
        survey_description: "",
        user_full_name: "",
        survey_subject_first_name: "",
        survey_subject_full_name: "",
        iteration_name: "",
      },
      selectedUserSurveys: [],
      surveyTemplateLink: "",
      website_url: "",
    };
  },
  props: [ 'data', 'loggedInUser'],
  async mounted() {
    this.user = JSON.parse(this.data);
    this.authenticatedUser = JSON.parse(this.loggedInUser);
    await api
      .get("organizations/" + this.user.org_id)
      .then((result) => {
        this.orgs = [result.data];
        this.survey.org_id = this.user.org_id;
        this.survey.recommended_number_of_nominations =
          result.data.d_recommended_number_of_nominations;
        this.survey.max_number_of_nominations =
          result.data.d_max_number_of_nominations;
        this.survey.report_eligible_number_of_respondents =
          result.data.d_report_eligible_number_of_respondents;
        return this.user.org_id;
      })
      .then(() => {
        api
          .get(
              `survey-template-association/org/${this.authenticatedUser.org_id}/suborg/${this.survey.suborg_id ? this.survey.suborg_id : 0 }`
          )
          .then((result) => {
            this.surveyTemplates = result.data;
          });
      })
      .then(() => {
        api.get("/sub-organizations/" + this.user.org_id).then((result) => {
          this.suborgs = result.data;
        });
      });

    try {
      const res = await api.get(`/brandswithsuborg/${this.user.org_id}`);
      if (res.status === 200) {
        this.website_url = res.data[0].website_url;
      }
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    encrypt(src, passphrase) {
      return CryptoJS.AES.encrypt(src, passphrase).toString();
    },

    reloadPrograms: async function () {
      this.survey.program_id = "";
      this.survey.iteration_id = "";
      this.survey.stream_id = "";
      this.survey.group_id = "";
      this.programs = [];
      this.iterations = [];
      this.streams = [];
      this.groups = [];
      this.surveyTemplates = [];
      await api
        .get("programs/suborg/" + this.survey.suborg_id)
        .then((result) => {
          this.programs = result.data;
        })
        .then(() => {
          api
          .get(
              `survey-template-association/org/${this.authenticatedUser.org_id}/suborg/${this.survey.suborg_id ? this.survey.suborg_id : 0 }`
          )
            .then((result) => {
              this.surveyTemplates = result.data;
            });
        });
    },

    reloadIterations: async function () {
      this.survey.iteration_id = "";
      this.survey.stream_id = "";
      this.survey.group_id = "";
      this.iterations = [];
      this.streams = [];
      this.groups = [];
      await api
        .get("iterations/program/" + this.survey.program_id)
        .then((result) => {
          this.iterations = result.data;
        });
    },

    reloadStreams: async function () {
      this.survey.stream_id = "";
      this.survey.group_id = "";
      this.streams = [];
      this.groups = [];
      await api
        .get("streams/iteration/" + this.survey.iteration_id)
        .then((result) => {
          this.streams = result.data;
        });
    },

    reloadGroups: async function () {
      this.survey.group_id = "";
      this.groups = [];
      await api.get("groups/stream/" + this.survey.stream_id).then((result) => {
        this.groups = result.data;
      });
    },

    getEmailTemplate(templateType, orgId, subOrgId, programId) {
      api
        .get(
          `email-templates/template-type/${templateType}/org/${orgId}/suborg/${subOrgId}/program/${programId}`
        )
        .then((response) => {
          this.emailTemplateId = response.data.email_template_id;
          this.subject = response.data.subject;
          this.email_body = response.data.email_body;
        });
    },

    swalValidation() {
      if (this.survey.program_id == "" && this.survey.iteration_id == "") {
        try {
          Swal.fire({
            text: `Program and iteration field is required.`,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Ok",
          }).then(() => {
            this.survey.program_id == ""
            this.survey.iteration_id == ""
          });
        } catch (error) {
          console.error(error);
        }
      } else if (
        this.survey.program_id != "" &&
        this.survey.iteration_id == ""
      ) {
        try {
          Swal.fire({
            text: `Iteration field is required.`,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Ok",
          })
        } catch (error) {
          console.error(error);
        }
      } else if (
        this.survey.program_id == "" &&
        this.survey.iteration_id != ""
      ) {
        try {
          Swal.fire({
            text: `Program field is required.`,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Ok",
          })
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          this.handleSave();
        } catch (error) {
          console.error(error);
        }
      }
    },

    async handleSave() {
      this.getEmailTemplate(
        "Admin user initiation",
        this.authenticatedUser.org_id,
        this.authenticatedUser.suborgs ? this.authenticatedUser.suborgs : 0,
        0
      );
      for (const data of this.surveyTemplates) {
        if (data.survey_template_id === this.survey.survey_template_id) {
          this.survey.survey_template_association_id =
            data.survey_template_association_id;
        }
      }
      if (!this.survey.deadline_initial || !this.survey.deadline_final) {
        this.$flashMessage.show({
          type: "error",
          title: "Initial deadline and final deadline are required fields",
        });
      } else if (!this.survey.survey_template_id) {
        this.$flashMessage.show({
          type: "error",
          title: "Survey Template is a required field",
        });
        return null;
      } else {
        var pass = this.validateDates(
          this.survey.deadline_initial,
          this.survey.deadline_final
        );
        if (!pass) {
          return this.$flashMessage.show({
            type: "error",
            title:
              "Please make sure the deadline final date is after the deadline initial date",
          });
        }
        if (this.survey.coach_report_start && this.survey.coach_report_end) {
          pass = this.validateDates(
            this.survey.coach_report_start,
            this.survey.coach_report_end
          );
          if (!pass) {
            return this.$flashMessage.show({
              type: "error",
              title:
                "Please make sure the coach report end date is after the coach report start date",
            });
          }
        }
      }


      await api
        .post("survey-assignments", {
          ...this.survey,
          logged_in_user: this.authenticatedUser.ind_id,
          ind_id: this.user.ind_id,
          recipient_email: this.user.email,
        })
        .then(() => {
          api.get(`survey-assignment/earliest-final-deadline-date/${this.survey.iteration_id}`)
            .then((result)=>{
                api.put(`iterations/final-deadline-date-update/${result.data.iteration_id}`, {
                  final_deadline_date: result.data.earliest_final_deadline,
                  modified_by: this.authenticatedUser.ind_id
                }).then((result)=>{
                  console.log(result)
                  this.$flashMessage.show({
                    type: result.data.type,
                    title: result.data.message,
                  });
                (this.survey.suborg_id = ""),
                  (this.survey.survey_template_id = ""),
                  (this.survey.survey_template_association_id = ""),
                  (this.survey.is_test = ""),
                  (this.survey.for_sample_report = ""),
                  (this.survey.program_id = ""),
                  (this.survey.iteration_id = ""),
                  (this.survey.stream_id = ""),
                  (this.survey.group_id = ""),
                  (this.survey.start = ""),
                  (this.survey.launch = ""),
                  (this.survey.reminder = ""),
                  (this.survey.deadline_initial = ""),
                  (this.survey.deadline_final = ""),
                  (this.survey.coach_report_start = ""),
                  (this.survey.coach_report_end = ""),
                  (this.survey.participant_report_start = "");
                })
            })
        })
        .catch((error) => {
          console.log(error);
        });
    },

    validateDates: function (a, b) {
      if (a && b) {
        const first = new Date(a);
        const second = new Date(b);
        if (second < first) {
          return false;
        }
      }
      return true;
    },

    async toPreviewSurvey(e) {
      try {
        const res = await api.get(
          `survey-templates/survey-type/${e.target.value}`
        );
        if (res.status === 200) {
          this.surveyTemplateLink = this.website_url + res.data.survey_file;
        }
        

      } catch (error) {
        console.log(error)
      }
    },

    previewSurvey(survey_template_link) {
      
      window.open(`${survey_template_link}?run_mode=ReadOnly`, '_blank')
    },
  },

  computed: {
    sortedSuborg: function () {
      return this.suborgs instanceof Array
        ? this.suborgs.sort((a, b) =>
            a.suborg_name.localeCompare(b.suborg_name)
          )
        : this.suborgs;
    },
    sortedSurveyTemplate: function () {
      return this.surveyTemplates
        .sort((a, b) =>
          a.survey_template_name.localeCompare(b.survey_template_name)
        )
        .filter(function (el) {
          if (el.nominee_survey_template_id != null) {
            return el;
          }
        }, this);
    },
    mapProgram: function () {
      return this.programs instanceof Array
        ? this.programs
            .sort((a, b) => a.program_name.localeCompare(b.program_name))
            .map(function (el) {
              if (
                this.user.org_id != "" ||
                this.user.org_id != undefined ||
                this.user.org_id !== null
              ) {
                if (
                  this.user.org_id == el.org_id &&
                  this.survey.suborg_id == el.suborg_id
                ) {
                  if (
                    el.program_id != undefined ||
                    el.program_name != undefined
                  ) {
                    return { value: el.program_id, label: el.program_name };
                  }
                }
              } else {
                return [];
              }
            }, this)
        : this.programs;
    },

    filteredProgram: function () {
      return this.mapProgram.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    mapIteration: function () {
      return this.iterations instanceof Array
        ? this.iterations
            .sort((a, b) => a.iteration_name.localeCompare(b.iteration_name))
            .map(function (el) {
              if (
                this.user.org_id != "" ||
                this.user.org_id != undefined ||
                this.user.org_id !== null
              ) {
                if (
                  this.user.org_id == el.org_id &&
                  this.survey.suborg_id == el.suborg_id &&
                  this.survey.program_id == el.program_id
                ) {
                  if (
                    el.iteration_id != undefined ||
                    el.iteration_name != undefined
                  ) {
                    return { value: el.iteration_id, label: el.iteration_name };
                  }
                }
              } else {
                return [];
              }
            }, this)
        : this.iterations;
    },

    filteredIteration: function () {
      return this.mapIteration instanceof Array
        ? this.mapIteration.filter(function (el) {
            return el !== undefined;
          }, this)
        : this.mapIteration;
    },

    sortedStream: function () {
      return this.streams instanceof Array
        ? this.streams.sort((a, b) =>
            a.stream_name.localeCompare(b.stream_name)
          )
        : this.streams;
    },
    sortedGroup: function () {
      return this.groups instanceof Array
        ? this.groups.sort((a, b) => a.group_name.localeCompare(b.group_name))
        : this.groups;
    },
  },
};
</script>


<style scoped>
* {
  font-family: "Arial";
}
input {
  margin: 0;
}
label {
  color: #000;
}
.input {
  width: 100%;
  outline: 0;
  border-width: 0 0 1px;
  padding: 10px;
  margin: 10px 0px;
  color: black;
}

.fg-orange {
  background: rgb(221, 166, 0);
}
.btn {
  width: 100%;
  background-color: #e67829;
}
.survey-preview {
  margin-left: 2em;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>