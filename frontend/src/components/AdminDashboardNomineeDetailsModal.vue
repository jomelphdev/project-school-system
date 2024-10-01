<script setup>
import api from "../api/api";
import HomeSkillBuilding from "./HomeSkillBuilding.vue";
import HomeReports from "./HomeReports.vue";
import HomeCohortReports from './HomeCohortReports.vue';
import HomeFacultyReport from './HomeFacultyReport.vue';
</script>

<template>
  <div class="box">
    <div class="modal-overlay" @click="$emit('close-modal')">
      <div class="modal-container">
        <div class="modal" @click.stop>
          <form v-if="nomineeData != []">
            <h2>User Details</h2>
            <hr />
            <h4>
              Email: <label>{{ nomineeData.email }}</label>
            </h4>
            <h4 v-if="nomineeSurveyData.full_name != null">
              Full name: <label>{{ nomineeSurveyData.full_name }}</label>
            </h4>
            <h4>
              Phone number: <label>{{ nomineeData.phone_number }}</label>
            </h4>
            <h4>
              Organization: <label>{{ nomineeData.org_name }}</label>
            </h4>
            <h4>
              Sub-organization:
              <label>{{ getSuborg(nomineeData.suborgs) }}</label>
            </h4>
            <h4>
              Roles: <label>{{ getRoles(nomineeData.roles) }}</label>
            </h4>
            <br />
            <br />
            <br />
            <div v-if="nomineeSurveyData != ''">
              <h2>Survey Details</h2>
              <hr />
              <h4>
                Template:
                <label>{{ nomineeSurveyData.survey_template_name }}</label>
              </h4>
              <h4 v-if="nominatedBy != ''">
                Nominated by: <label>{{ nominatedBy.full_name }}</label>
              </h4>
              <h4>
                Launch date:
                <label>{{ readDate(nomineeSurveyData.launch_date) }}</label>
              </h4>
              <h4>
                Final deadline date:
                <label>{{
                  readDate(nomineeSurveyData.final_deadline_date)
                }}</label>
              </h4>
              <h4>
                Submitted date:
                <label>{{ readDate(nomineeSurveyData.submission_date) }}</label>
              </h4>
              <h4 v-if="nomineeSurveyData.coach_email == null">
                Coach: <label>No coach assigned</label>
              </h4>
              <h4 v-else>
                Coach: <label>{{ nomineeSurveyData.coach_email }}</label>
              </h4>
              <h4>
                Status: <label>{{ nomineeSurveyData.STATUS }}</label>
              </h4>
              <h4>
                Nominations submitted:
                <label>{{ nomineeSurveyData.nominations_submitted }}</label>
              </h4>
            </div>
          </form>

          <div v-if="nomineeSurveyData != ''">
            <h2>Survey Screen</h2>
            <hr />
            <HomeSkillBuilding
              class="import-component"
              :userId="nominee_ind_id"
              :brandData="brandData"
              :userData="userData"
              :runMode="'ReadOnly'"
            />
          </div>

          <div  v-if="nomineeSurveyData != ''">
            <h2>Report Screen</h2>
            <hr />
            <HomeReports
              class="import-component"
              :userId="nominee_ind_id"
              :brandData="brandData"
              :userData="userData"
            />
          </div>

          <div v-if="coach_ind_id">
            <h2>Coach Report Screen</h2>
            <hr />
            <HomeCohortReports
              class="import-component"
              :coachId="coach_ind_id"
              :brandData="brandData"
              :userData="userData"
            />
          </div>

          <div v-if="faculty_org && faculty_suborg">
            <h2>Faculty Report Screen</h2>
            <hr />
            <HomeFacultyReport
              class="import-component"
              :facultyOrg="faculty_org"
              :facultySuborg="faculty_suborg"
              :brandData="brandData"
              :userData="userData"
            />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminDashboardNominationModal",
  props: [
    "nominee_ind_id",
    "coach_ind_id",
    "faculty_org",
    "faculty_suborg",
    "survey_assignment_id",
    "participant_nominated_id",
    "brandData",
    "userData",
  ],
  components: [HomeSkillBuilding, HomeReports, HomeCohortReports, HomeFacultyReport],

  data: () => ({
    nomineeData: [],
    roleData: [],
    userSubOrg: [],
    nomineeSurveyData: "",
    nominatedBy: "",
  }),

  async created() {
    console.log(this.faculty_suborg)

    await api.get("sub-organizations/").then((result) => {
      this.userSubOrg = result.data;
    });

    await api.get("roles").then((result) => {
      this.roleData = result.data;
    });

    if (this.nominee_ind_id) {
      await api.get(`individuals/${this.nominee_ind_id}`).then((result) => {
        this.nomineeData = result.data;
        // console.log(result.data);
      });
    }

    if (this.survey_assignment_id) {
      await api
        .get(
          `survey-assignments-admin-dashboard/survey-assignment-id/${this.survey_assignment_id}`
        )
        .then((result) => {
          result.data.map((data) => {
            this.nomineeSurveyData = data;
          });
          // console.log(this.nomineeSurveyData);
        });
    }

    if (this.participant_nominated_id) {
      await api
        .get(
          `survey-assignments-nominee-details/${this.participant_nominated_id}`
        )
        .then((result) => {
          result.data.map((data) => {
            this.nominatedBy = data;
          });
        });
    }
    // console.log(this.tableData)
  },
  methods: {
    getSuborg(data) {
      if (data != 0 && data != null && data != undefined && data != "") {
        var newValue = data.split(", ");
        var newName = newValue.map(
          (r) => this.userSubOrg.find((f) => f.suborg_id == r).suborg_name
        );
        return newName.join(", ");
      } else {
        return null;
      }
    },
    getRoles(data) {
      if (data != 0 && data != null && data != undefined && data != "") {
        var newValue = data.split(", ");
        var newRoleName = newValue.map(
          (r) => this.roleData.find((f) => f.role_id == r).role_name
        );
        return newRoleName.join(", ");
      } else {
        return null;
      }
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
};
</script>

<style scoped>
p {
  font-weight: normal;
}
.icon-background1 {
  color: red;
  /* background-color: black; */
}
.fa-star {
  color: green;
}
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000cf;
  z-index: 1;
}

.modal-container {
  margin-top: 3%;
  height: 100vh;
  width: 80%;
  max-height: calc(100vh - 210px);
}

.modal {
  text-align: left;
  background-color: white;
  padding: 0 30px 0 30px; /* padding settings left and right */
  height: 120vh;
  max-height: calc(100vh - 110px);
  border-radius: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

button {
  width: 170px;
  height: 35px;
  color: white;
  font-size: 12px;
  border-radius: 16px;
  margin: 10px 10px 0 0;
  /* padding: 10px; */
}

.button-container {
  display: flex;
  flex-direction: row;
}

.import-component {
  width: 5%;
  margin: 0 0 50px 0;
}

.box {
  align-self: center;
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0px 2px 10px -4px #000000;
}

h2 {
  margin: 10px 0 5px 0;
}
h4 {
  margin: 0 0 0 0;
  height: 22px;
}
</style>