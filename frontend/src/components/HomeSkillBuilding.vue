<script setup>
import ButtonSubmit from "./ButtonSubmit.vue";
import api from "../api/api";
import { flashMessage } from "../functions.js";
</script>

<template>
  <div class="main-div">
    <!-- <div class="loginInfo">
       <div><div class="icon_container"><i class="fa-solid fa-check"></i></div>  Currently logged in as: {{ userData.first_name + " " + userData.last_name }} ({{ userData.email }})</div>
     </div> -->
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
    <div class="parent" v-show="toggle">
      <h2 v-if="noSurvey">No tasks assigned to you at this time</h2>

      <div
        v-for="data in surveyAssignments"
        :key="data.survey_assignment_id"
        style="cursor: pointer"
        :class="
          data.submitted_status == 1 || data.dropped_status == 1
            ? 'child-submitted'
            : 'child'
        "
      >
        <!-- logo images  -->
        <div>
          <h2>{{ data.surveyName }}</h2>
          <h2>{{ data.iterationName }}</h2>
          <h3 v-if="data.subjectFullName != null">
            {{ "For: " + data.subjectFullName }}
          </h3>
          <div>
            <p>{{ data.programName }}</p>
          </div>
          <div v-if="data.survey_type == 1">
            <img
              class="surveyLogo"
              src="../../public/survey_logo/big5_survey_logo.png"
            />
          </div>
          <div v-if="data.survey_type == 2">
            <img
              class="surveyLogo"
              src="../../public/survey_logo/360_survey_logo.png"
            />
          </div>
          <div v-if="data.survey_type == 3">
            <img
              class="surveyLogo"
              src="../../public/survey_logo/research_survey_logo.png"
            />
          </div>
          <div v-if="data.survey_type == 4 && data.survey_file == 'QSort-BEP.html'">
            <img
              class="surveyLogo"
              src="../../public/survey_logo/qSort_BEP.png"
            />
          </div>
          <div v-if="data.survey_type == 4 && data.survey_file == 'QSort-GDP.html'">
            <img
              class="surveyLogo"
              src="../../public/survey_logo/qSort_GDP.png"
            />
          </div>
          <div v-if="data.survey_type == 4 && data.survey_file == 'QSort-OCM.html'">
            <img
              class="surveyLogo"
              src="../../public/survey_logo/qSort_OCM.png"
            />
          </div>
          <div v-if="data.survey_type == 5">
            <img
              class="surveyLogo"
              src="../../public/survey_logo/VFP_logo.png"
            />
          </div>
        </div>
        <!-- end of logo images  -->

        <!-- survey messages  -->
        <div>
          <div v-for="(item, index) in data.surveyMessages" :key="index">
            <!-- hide the null message type -->
            <div
              v-if="item.survey_message_type != ''"
              class="list-item"
              :style="{ backgroundColor: getStyle(item.survey_message_type) }"
            >

              <div class="survey-message-container" v-if="item.survey_message_type == 'Qualified'">
                <div><i class="fa-solid fa-check"></i></div>
                <div>{{ item.survey_message }}</div>
              </div>

              <div class="survey-message-container" v-if="item.survey_message_type == 'Info'">
                <div><i class="fa-solid fa-info"></i></div>
                <div>{{ item.survey_message }}</div>
              </div>

              <div class="survey-message-container" v-if="item.survey_message_type == 'Warning'">
                <div><i class="fa-solid fa-triangle-exclamation"></i></div>
                <div>{{ item.survey_message }}</div>
              </div>
              
            </div>
          </div>
        </div>
        <!-- end of survey messages  -->

        <!-- self assessment  -->
        <div v-if="data.survey_type === '1' || data.survey_type === '3' || data.survey_type === '4' || data.survey_type === '5'">
          <div
            v-if="
              data.is_nomination == 0 &&
              data.submitted_status == 0 &&
              data.dropped_status == 0
            "
          >
            <button
              :disabled="data.isShow == 'no'"
              :class="
                data.isShow == 'no'
                  ? 'btn-disabled btn-take-survey'
                  : 'btn-nominee btn-take-survey'
              "
              @click="
                takeSurvey(
                  data.survey_template_link,
                  data.survey_assignment_id,
                  data.ind_id,
                  data.org_id,
                  data.suborg_id,
                  data.subjectFullName,
                  data.survey_template_id,
                  data.iteration_id
                )
              "
            >
              Take Survey
            </button>
          </div>
          <button
            v-show="
              data.is_nomination == 0 &&
              data.submitted_status == 1 &&
              data.dropped_status == 0
            "
            disabled
            class="btn-disabled btn-survey-completed"
          >
            Survey Completed
          </button>
        </div>
        <!-- end of self assessment  -->

        <!-- 360 nomination -->
        <div v-else-if="data.survey_type == 2">
          <div class="d-flex">
            <button
              :disabled="data.isShow == 'no'"
              v-if="
                data.is_nomination == 0 &&
                data.submitted_status == 0 &&
                data.dropped_status == 0
              "
              :class="
                data.isShow == 'no'
                  ? 'btn-disabled px-25px'
                  : 'btn-nominee px-25px'
              "
              @click="
                takeSurvey(
                  data.survey_template_link,
                  data.survey_assignment_id,
                  data.ind_id,
                  data.org_id,
                  data.suborg_id,
                  data.subjectFullName,
                  data.survey_template_id,
                  data.iteration_id
                )
              "
            >
              Take Survey
            </button>

            <button
              v-if="
                data.submitted_status == 1 &&
                data.is_nomination == 0 &&
                data.dropped_status == 0
              "
              disabled
              class="btn-disabled"
            >
              Survey Completed
            </button>

            <button
              :disabled="data.isShow == 'no'"
              @click="
                sendProps(
                  data.surveyName,
                  data.survey_assignment_id,
                  data.org_id,
                  data.suborg_id,
                  data.program_id,
                  data.iteration_id,
                  data.stream_id,
                  data.group_id,
                  data.survey_template_id,
                  data.survey_template_association_id,
                  data.ind_id,
                  data.recipient_email
                )
              "
              v-if="data.submitted_status == 1 && data.is_nomination == 0 && data.dropped_status == 0"
              :class="data.isShow == 'no' ? 'btn-disabled' : 'btn-nominee'"
            >
              Make Nomination
            </button>
            <button
              :disabled="data.isShow == 'no'"
              @click="
                sendProps(
                  data.surveyName,
                  data.survey_assignment_id,
                  data.org_id,
                  data.suborg_id,
                  data.program_id,
                  data.iteration_id,
                  data.stream_id,
                  data.group_id,
                  data.survey_template_id,
                  data.survey_template_association_id,
                  data.ind_id,
                  data.recipient_email
                )
              "
              v-if="data.submitted_status == 0 && data.is_nomination == 0 && data.dropped_status == 0"
              :class="data.isShow == 'no' ? 'btn-disabled' : 'btn-nominee'"
            >
              Make Nomination
            </button>
          </div>

          <!-- if the indivual is nominee and also participant and not yet submitted the survey -->
          <button
            :disabled="data.isShow == 'no'"
            v-show="
              data.is_nomination == 1 &&
              data.submitted_status == 0 &&
              data.dropped_status == 0
            "
            :class="
              data.isShow == 'no'
                ? 'btn-disabled btn-take-survey-participant-nominee'
                : 'btn-nominee btn-take-survey-participant-nominee'
            "
            @click="
              takeSurvey(
                data.survey_template_link,
                data.survey_assignment_id,
                data.ind_id,
                data.org_id,
                data.suborg_id,
                data.subjectFullName,
                data.survey_template_id,
                data.iteration_id
              )
            "
          >
            Take Survey
          </button>

          <!-- if the indivual is nominee and already submitted the survey -->
          <button
            v-show="
              data.is_nomination == 1 &&
              data.submitted_status == 1 &&
              data.dropped_status == 0
            "
            disabled
            class="btn-disabled btn-survey-completed-participant-nominee"
          >
            Survey Completed
          </button>
        </div>

        <!-- end of 360 nomination -->

        <!-- dropped status  -->
        <div v-if="data.dropped_status === 1">
          <button
            v-if="data.dropped_status === 1"
            disabled
            class="btn-disabled btn-survey-completed-participant-nominee"
          >
            Dropped
          </button>
        </div>
        <!-- end of dropped status  -->
        <div class="tooltip" v-if="userId" style="margin-top: 10px">
          Information
          <span class="tooltiptext"
            >- Above this tooltip shows exactly what the participant see in
            their survey tile screen.
            <br />
            <br />- This tooltip and the button under this only shows for Admin
            to view the survey.</span
          >
        </div>
        <button
          v-if="userId"
          class="btn-nominee btn-take-survey-participant-nominee"
          @click="
            takeSurvey(
              data.survey_template_link,
              data.survey_assignment_id,
              data.ind_id,
              data.org_id,
              data.suborg_id,
              data.subjectFullName,
              data.survey_template_id,
              data.iteration_id
            )
          "
        >
          Admin access to survey
        </button>
      </div>
      <!-- for loop  -->
    </div>
    <!-- parent  -->
  </div>
  <!-- main-div  -->
</template>

<script>
export default {
  components: [ButtonSubmit],
  name: "HomeSkillBuilding",
  data: () => ({
    surveyId: "",
    toggle: true,
    surveyAssignments: [
      {
        surveyMessages: [],
      },
    ],
    noSurvey: false,
    isNominee: false,
  }),
  props: {
    reportName: String,
    surveyName: String,
    dateTime: String,
    buttonLabel: String,
    label: String,
    buttonColor: String,
    userData: Object,
    brandData: Object,
    userId: Number,
    runMode: String,
  },
  methods: {
    getStyle(data) {
      if (data == "Warning") {
        return "rgb(255, 244, 229)";
      } else if (data == "Qualified") {
        return "rgb(237, 247, 237)";
      } else if (data == "Info") {
        return "rgb(232, 244, 253)";
      }
    },
    sendProps(
      surveyName,
      surveyAssignmentID,
      orgID,
      suborgID,
      programID,
      iterationID,
      streamID,
      groupID,
      surveyTemplateID,
      surveyTemplateAssociationID,
      indID,
      recipientEmail
    ) {
      const data = {
        surveyName: surveyName,
        surveyAssignmentID: surveyAssignmentID,
        orgID: orgID,
        suborgID: suborgID,
        programID: programID,
        iterationID: iterationID,
        streamID: streamID,
        groupID: groupID,
        surveyTemplateID: surveyTemplateID,
        surveyTemplateAssociationID: surveyTemplateAssociationID,
        indID: indID,
        recipientEmail: recipientEmail,
      };
      this.$router.push({
        name: "make_nominations",
        params: { data: JSON.stringify(data) },
      });
    },
    // async getSingleIndividual() {
    //   await api
    //     .get(`individuals-single/${this.userData.ind_id}`)
    //     .then((res) => {
    //       if(res.data.is_nominee == 1) return this.isNominee = true
    //     })
    // },
    takeSurvey(
      survey_template_link,
      survey_assignment_id,
      ind_id,
      org_id,
      suborg_id,
      subjectFullName,
      survey_template_id,
      iteration_id
    ) {
      const data = {
        surveyTemplateLink: survey_template_link,
        surveyAssignmentLink: survey_assignment_id,
        indId: ind_id,
        orgId: org_id,
        suborgId: suborg_id,
        subjectFullName: subjectFullName,
        surveyTemplateId: survey_template_id,
        iteartionId: iteration_id,
        runMode: this.runMode
      };
      this.$router.push({
        name: "MySurvey",
        params: { data: JSON.stringify(data) },
      });
      this.$emit(
        "passSubjectFullName",
        subjectFullName ? subjectFullName : "none"
      );
    },
  },
  async mounted() {
    // console.log(this.userData)

    //if userId is not undefined, set surveyId. userId being passed from adminDashboardNomineeDetailsModal
    if (this.userId) {
      this.surveyId = this.userId;
    } else {
      this.surveyId = this.userData.ind_id;
    }

    await api
      .get(`survey-assignments/individuals/${this.surveyId}`)
      .then((res) => {
        this.surveyAssignments = res.data;
        // console.log(res.data);
        if (this.surveyAssignments.length <= 0) {
          this.noSurvey = true;
          return null;
        }
        api.get(`/brandswithsuborg/${this.userData.org_id}`).then((results) => {
          let getBrandData = results.data;
          this.surveyAssignments.forEach((list) => {
            list.survey_template_link =
              getBrandData[0].website_url + list.survey_file;
          });
          this.surveyAssignments.forEach((listItem) => {
            api
              .get(`survey-active-message/${listItem.survey_assignment_id}`)
              .then((response) => {
                listItem.surveyMessages = response.data;
                listItem.surveyName =
                  listItem.surveyMessages[0].survey_template_name;
                listItem.programName = listItem.surveyMessages[0].program_name;
                listItem.iterationName =
                  listItem.surveyMessages[0].iteration_name;
                listItem.subjectFullName =
                  listItem.surveyMessages[0].subject_full_name;
              });
          });
        });
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
    // this.getSingleIndividual()
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
  padding-left: 0;
  padding: 10px;
}
.child {
  /* flex: 1; */
  /* border: 1px solid #ccc; */
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
.list-item {
  text-align: left;
  padding: 10px;
  margin: 8px 0;
  box-shadow: 2px 4px #ccc;
}
.list-item .icon_container {
  padding-bottom: 1px;
  margin-bottom: 35px;
  color: #252525af;
  float: left;
  width: 34px;
  text-align: center;
  font-size: 15.5px;
}
.btn {
  width: 100%;
}
.d-flex {
  display: flex;
}
.btn-nominee {
  background-color: v-bind(
    'brandData.main_color2 ? brandData.main_color2 : "#b2c225"'
  );
  color: v-bind(
    'brandData.button_text_color ? brandData.button_text_color : "#54575B"'
  );
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  border: 1px solid rgba(27, 31, 35, 0.15);
  font-weight: 500;
  margin-left: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 5px;
}
.btn-disabled {
  background-color: #e2e2e2;
  color: #000000;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid rgba(27, 31, 35, 0.15);
  font-weight: 500;
  margin-left: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 5px;
}
.btn-nominee:hover {
  text-decoration: none;
  background-color: v-bind(
    'brandData.main_color2 ? brandData.main_color2 : "#b2c225"'
  );
  opacity: 0.8;
  transition-duration: 0.1s;
}
.px-25px {
  padding-left: 25px;
  padding-right: 25px;
}
.btn-survey-completed {
  padding: 14px 35px 14px 35px;
}
.btn-take-survey {
  padding: 14px 55px 14px 55px;
}
.btn-survey-completed-nominee {
  padding: 7px 38px 7px 38px;
}
.btn-survey-completed-participant-nominee {
  padding: 13px 38px 13px 38px;
}
.btn-take-survey-participant-nominee {
  padding: 13px 57px 13px 57px;
}
.loginInfo {
  border-radius: 4px;
  box-shadow: none;
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.43;
  letter-spacing: 0.01071em;
  background-color: rgb(237, 247, 237);
  padding: 12px;
  margin-bottom: 20px;
}

.loginInfo .icon_container {
  color: #252525af;
  float: left;
  width: 34px;
  text-align: center;
  font-size: 20px;
  margin-top: -4px;
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

.survey-message-container {
  display: flex;
}

.survey-message-container > div {
  margin: 5px;
  font-size: 15.5px;
}

@media only screen and (min-width: 280px) and (max-width: 540px) {
  .main-div {
    margin: 0 5px 0 5px;
  }
}
</style>
