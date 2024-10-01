<script setup>
import api from "../api/api";
import AdminDashboardNomineeDetailsModal from "./AdminDashboardNomineeDetailsModal.vue";
</script>

<template>
  <div class="box">
    <div class="modal-overlay" @click="$emit('close-modal')">
      <div class="modal-container">
        <div class="modal" @click.stop>
          <h3>View Nominations</h3>

          <table id="table">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Relationship</th>
              <th>Nomination date</th>
              <th>Submitted date</th>
              <th>Final deadline date</th>
              <th>Logged In</th>
              <th>Survey status (Based on iteration)</th>
            </tr>
            <tr v-for="data in tableData" :key="data" :value="data">
              <td>
                {{ data.full_name }}
                <a
                  @click="
                    showNomineeModal(data.ind_id, data.survey_assignment_id)
                  "
                  style="cursor: pointer"
                  ><i class="fa-solid fa-pencil"></i
                ></a>
              </td>
              <td>{{ data.email }}</td>
              <td>{{ data.relationship_name }}</td>
              <td>{{ readDate(data.created_at) }}</td>
              <td>{{ readDate(data.date_submitted) }}</td>
              <td>{{ readDate(data.final_deadline_date) }}</td>
              <td>
                {{ data.logged_in }}
                <a v-if="data.logged_in == 'Yes'"
                  ><i class="fa-solid fa-star"></i
                ></a>
                <a v-else
                  ><i class="fas fa-info-circle icon-background1"></i
                ></a>
              </td>
              <td>
                {{ data.STATUS }}
                <a
                  v-if="
                    data.STATUS != 'Closed (unsubmitted)' &&
                    data.STATUS != 'Not yet launched' &&
                    data.STATUS != 'Dropped' &&
                    data.STATUS != 'Report expired'
                  "
                  ><i class="fa-solid fa-star"></i
                ></a>
                <a v-else
                  ><i class="fas fa-info-circle icon-background1"></i
                ></a>
              </td>
            </tr>
          </table>
          <AdminDashboardNomineeDetailsModal
            v-if="showModal == true"
            @close-modal="showModal = false"
            :nominee_ind_id="nominee_ind_id"
            :survey_assignment_id="nominee_survey_assignment_id"
            :participant_nominated_id="surveyAssignmentId"
            :brandData="brandData"
            :userData="userData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminDashboardNominationModal",
  props: ["surveyAssignmentId", "brandData", "userData"],
  components: [AdminDashboardNomineeDetailsModal],
  async mounted() {
    // console.log(this.brandData);
    await api
      .get(`/survey-assignments/nominee/${this.surveyAssignmentId}`)
      .then((result) => {
        this.tableData = result.data;
        // console.log(result.data)
      });
  },
  methods: {
    showNomineeModal(ind_id, survey_assignment_id) {
      // console.log(this.surveyAssignmentId)
      this.showModal = true;
      this.nominee_ind_id = ind_id;
      this.nominee_survey_assignment_id = survey_assignment_id;
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
  data: () => ({
    tableData: [],
    nominee_ind_id: "",
    nominee_survey_assignment_id: "",
    showModal: false,
  }),
};
</script>

<style scoped>
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
  background-color: #000000b6;
  z-index: 1;
}

.modal-container {
  margin-top: 5%;
  height: 100vh;
  width: 90%;
  max-height: calc(100vh - 210px);
}

.modal {
  text-align: left;
  background-color: white;
  padding: 0 30px 0 30px; /* padding settings left and right */
  height: 100vh;
  max-height: calc(100vh - 210px);
  border-radius: 10px;
  overflow-y: auto;
}

button {
  background-color: #ac003e;
  width: 150px;
  height: 40px;
  color: white;
  font-size: 14px;
  border-radius: 16px;
  margin-top: 50px;
}

.box {
  align-self: center;
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0px 2px 10px -4px #000000;
}
#table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
}

#table td,
#table th {
  border: 1px solid #ddd;
  padding: 8px;
  /* word-break: word-wrap; */
}

#table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#table tr:hover {
  background-color: #ddd;
}

#table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #0e5071;
  color: white;
}

#table td {
  text-align: left;
  vertical-align: middle;
}
</style>