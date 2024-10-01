<script setup>
import api from "../api/api";
import DescriptionInline from "./DescriptionInline.vue";
import DropDownInfo from "./DropDownInfo.vue";
import ButtonSubmit from "./ButtonSubmit.vue";
import { flashMessage } from "../functions.js";
import EmailSentTable from "./EmailSentTable.vue";
import AdminDashboardNomineeDetailsModal from "./AdminDashboardNomineeDetailsModal.vue";
import Swal from "sweetalert2";
// import ClipLoader from "vue-spinner/src/ClipLoader.vue";
</script>

<template>
  <div>
    <label for="criteria"><DescriptionInline label="Search for" /></label>
    <input
      v-model="email"
      id="criteria"
      placeholder="Search a User"
      class="input1"
      required
    />

    <br />

    <ButtonSubmit
      @click.prevent="searchResult"
      label="Find"
      :disabled="fetchedData.length == 0"
    />
    <div class="button-section">
      <ButtonSubmit @click.prevent="createUser" label="Add User" />
      <ButtonSubmit @click.prevent="bulkUpload" label="Add Many" />
    </div>

    <br />
    <strong><p>Click on table results/view button to add survey *</p></strong>
    <br />
    <!-- <clip-loader
      :loading="setLoading"
      :color="setColor"
      :size="setSize"
    ></clip-loader> -->
    <div>
      <table id="table">
        <tr>
          <th style="width: 4%; text-align: right">#</th>
          <th>First name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Roles</th>
          <th>Added</th>
          <th>Last Login</th>
          <th>Actions</th>
        </tr>
        <tr
          v-for="(data, index) in filteredData"
          :key="data.ind_id"
          :value="data.ind_id"
          @click="selectUser(data)"
          style="cursor: pointer"
          :class="{ active: active_el == data }"
        >
          <td style="text-align: right">{{ incrementIndex(index) }}</td>
          <td>{{ data.first_name }}</td>
          <td>{{ data.last_name }}</td>
          <td>{{ data.email }}</td>
          <td>{{ getRoles(data.roles) }}</td>
          <td>{{ readDate(data.created_at) }}</td>
          <td>{{ readDate(data.last_login_date) }}</td>
          <td>
            <button @click="sendProps(data)" class="td-btn">
              Edit
              <i class="fa-regular fa-edit" aria-hidden="true"></i>
            </button>
            <button @click="selectUser(data)" class="td-btn">
              View
              <i class="fa-regular fa-eye" aria-hidden="true"></i>
            </button>
            <button
              v-if="checkCoachRole == true"
              @click="showCoachScreen(data.ind_id, data.roles)"
              class="td-btn"
            >
              Coach Home Screen
              <i class="fa-regular fa-eye" aria-hidden="true"></i>
            </button>
            <button
              v-if="checkFacultyRole == true"
              @click="showFacultyScreen(data.ind_id, data.org_id, data.suborgs, data.roles)"
              class="td-btn"
            >
              Faculty Home Screen
              <i class="fa-regular fa-eye" aria-hidden="true"></i>
            </button>
          </td>
        </tr>
      </table>

      <br />
      <div v-if="Object.keys(selectedUser).length != 0">
        <strong><p>User information</p></strong>

        <strong><span>Email:</span></strong>
        <span>&nbsp;&nbsp;{{ selectedUser.email }}</span>
        <br />
        <strong><span>Original Email:</span></strong>
        <span>&nbsp;&nbsp;{{ selectedUser.original_email }}</span>
        <div>
          <strong><span>Current program:</span></strong>
          <span>&nbsp;&nbsp;{{ selectedUserDetails.user_program }}</span>
        </div>
        <div>
          <strong><span>Current iteration:</span></strong>
          <span>&nbsp;&nbsp;{{ selectedUserDetails.user_iteration }}</span>
        </div>
        <div>
          <strong><span>Current stream:</span></strong>
          <span>&nbsp;&nbsp;{{ selectedUserDetails.user_stream }}</span>
        </div>
        <div>
          <strong><span>Current group:</span></strong>
          <span>&nbsp;&nbsp;{{ selectedUserDetails.user_group }}</span>
        </div>
        <div>
          <strong><span>Surveys assigned:</span></strong>
          <span>&nbsp;&nbsp;{{ selectedUserDetails.survey_name }}</span>
        </div>
        <div>
          <strong><span>Survey program:</span></strong>
          <span>&nbsp;&nbsp;{{ selectedUserDetails.survey_program }}</span>
        </div>
        <div>
          <strong><span>Survey iteration:</span></strong>
          <span>&nbsp;&nbsp;{{ selectedUserDetails.survey_iteration }}</span>
        </div>
        <div>
          <strong><span>Survey stream:</span></strong>
          <span>&nbsp;&nbsp;{{ selectedUserDetails.survey_stream }}</span>
        </div>
        <div>
          <strong><span>Survey group:</span></strong>
          <span>&nbsp;&nbsp;{{ selectedUserDetails.survey_group }}</span>
        </div>
        <EmailSentTable
          label="Emails sent to user"
          :tableData="selectedUser"
          :key="renderComponent"
        />
        <!-- <DropDownInfo label="SMS messages sent to user"  /> -->

        <ButtonSubmit @click="sendToSurvey(selectedUser)" label="Add Survey" />

        <DropDownInfo label="User surveys" />
        <DropDownInfo label="Deleted user surveys" />
      </div>
    </div>
    
    <AdminDashboardNomineeDetailsModal
      v-if="show_nominee_modal_coach == true"
      @close-modal="show_nominee_modal_coach = false"
      :nominee_ind_id="nominee_ind_id"
      :coach_ind_id="coach_ind_id"
      :brandData="brandData"
      :userData="userData"
    />

    <AdminDashboardNomineeDetailsModal
      v-if="show_nominee_modal_faculty == true"
      @close-modal="show_nominee_modal_faculty = false"
      :nominee_ind_id="nominee_ind_id"
      :faculty_org="faculty_org"
      :faculty_suborg="faculty_suborg"
      :brandData="brandData"
      :userData="userData"
    />
  </div>
</template>

<script>
export default {
  name: "FindUserSearchBox",
  component: [
    DescriptionInline,
    DropDownInfo,
    ButtonSubmit,
    EmailSentTable,
    AdminDashboardNomineeDetailsModal,
  ],
  props: ["userData", "brandData"],
  data: () => ({
    email: "",
    firstName: "First name*",
    lastName: "Last name*",
    phoneNumber: "Phone number",
    timeZone: "Select time-zone",
    organisation: "Select organisation",
    roles: {},
    roleName: [],
    suppressEmail: false,
    fetchedData: [],
    filteredData: [],
    selectedUser: {},
    selectedUserDetails: {},
    active_el: 0,
    fetchSendEmailData: [],
    renderComponent: 0,
    show_nominee_modal_coach: false,
    show_nominee_modal_faculty: false,
    nominee_ind_id: "",
    coach_ind_id: "",
  }),
  async mounted() {
    if (!this.userData.roles.includes("16")) {
      await api
        .get(`individuals/org/${this.userData.org_id}`)
        .then((result) => {
          this.fetchedData = result.data;
        });
    } else {
      await api.get(`individuals`).then((result) => {
        this.fetchedData = result.data;
      });
    }

    await api.get("roles").then((result) => {
      this.roles = result.data;
    });
  },
  methods: {
    incrementIndex(index) {
      return index + 1;
    },

    searchResult() {
      this.filteredData = this.fetchedData.filter((data) => {
        // console.log(data);
        if (
          data.first_name == null ||
          data.last_name == null ||
          data.first_name == "" ||
          data.last_name == ""
        ) {
          return (
            data.email.toLowerCase().includes(this.email.toLowerCase())
          );
        } else {
          return (
            data.email.toLowerCase().includes(this.email.toLowerCase()) ||
            data.first_name.toLowerCase().includes(this.email.toLowerCase()) ||
            data.last_name.toLowerCase().includes(this.email.toLowerCase())
          );
        }
      });

      if (this.filteredData.length == 0) {
        flashMessage(
          this.$flashMessage,
          this.brandData.accent_color1
            ? this.brandData.accent_color1
            : "#F47820",
          this.brandData.flash_text_color
            ? this.brandData.flash_text_color
            : "#ffffff",
          "No result found."
        );
      } else {
        flashMessage(
          this.$flashMessage,
          this.brandData.accent_color1
            ? this.brandData.accent_color1
            : "#F47820",
          this.brandData.flash_text_color
            ? this.brandData.flash_text_color
            : "#ffffff",
          this.filteredData.length + " result(s) found."
        );
      }

      if (this.selectedUser.length != 0) {
        this.selectedUser = {};
        this.active_el = 0;
      }
    },

    getRoles(r) {
      var newValue = r.split(", ");
      var newRoleName = newValue.map(
        (r) => this.roles.find((f) => f.role_id == r).role_name
      );
      return newRoleName.join(", ");
    },

    sendProps(data) {
      this.$router.push({
        name: "CreateEditUserBox",
        params: { data: JSON.stringify(data) },
      });
    },
    createUser() {
      this.$router.push({
        name: "CreateEditUserBox",
      });
    },
    bulkUpload() {
      this.$router.push({
        name: "upload_many_users_at_once",
      });
    },
    async sendToSurvey(user) {
      this.$router.push({
        name: "Add_survey",
        params: {
          data: JSON.stringify(user),
          loggedInUser: JSON.stringify(this.userData),
        },
      });
    },

    async selectUser(user) {
      // console.log(user);
      await api
        .get(`individual-details-from-ig/${user.ind_id}`)
        .then((result) => {
          result.data.map((userDetails) => {
            this.selectedUserDetails = userDetails;
          });
          // console.log(this.selectedUserDetails)
        });
      this.selectedUser = user;
      this.active_el = user;
      this.renderComponent++;
    },

    showCoachScreen(ind_id, roles) {
      if (roles.includes("4")) {
        this.show_nominee_modal_coach = true;
        this.nominee_ind_id = ind_id;
        this.coach_ind_id = ind_id;
      } else {
        Swal.fire({
          text: "This user don't have a coach role.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        });
      }
    },

    showFacultyScreen(ind_id, org_id, suborgs, roles) {
      let splitArray = suborgs.split(",")
      let joinSuborg= splitArray.join(",")
      if (roles.includes("5")) {
        this.show_nominee_modal_faculty = true;
        this.nominee_ind_id = ind_id;
        this.faculty_org = org_id;
        this.faculty_suborg = joinSuborg;
      } else {
        Swal.fire({
          text: "This user don't have a faculty role.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        });
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
  computed: {
    selectedUserRole: function () {
      if (
        this.selectedUser.roles == undefined ||
        this.selectedUser.roles == null
      ) {
        return false;
      } else {
        return true;
      }
    },

    checkCoachRole: function () {
      if (this.selectedUserRole == false) {
        return false;
      } else {
        if (this.selectedUser.roles.includes("4")) {
          return true;
        } else {
          return false;
        }
      }
    },

    checkFacultyRole: function () {
      if (this.selectedUserRole == false) {
        return false;
      } else {
        if (this.selectedUser.roles.includes("5")) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
};
</script>

<style scoped>
.td-btn {
  margin: 5px;
  cursor: pointer;
}

.box {
  border: 1px solid #ccc;
  border-top: 4px solid rgb(185, 22, 10);
  text-align: center;
  margin: 0 10px;
  min-height: 400px;
  padding: 10px;
  max-width: 250px;
  min-height: 620px;
}
.btn {
  width: 100%;
  background-color: #e67829;
}

.label1 {
  top: 0px;
  left: 0px;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.54);
  font-family: Arial, Helvetica, sans-serif;
}

.input1 {
  width: 100%;
  outline: 0;
  border-width: 0 0 1px;
  border-color: grey;
  padding: 2px 5px;
  margin: 10px 0px;
}

#table {
  width: 100%;
  word-break: break-all;
  table-layout: fixed;
  border-collapse: collapse;
  /* white-space: nowrap; */
}

#table .absorbing-column {
  width: 100%;
}

#table td,
#table th {
  border: 1px solid #ddd;
  padding: 8px;
}

#table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#table tr:hover {
  background-color: #ddd;
}

.active {
  background-color: #32bfb8 !important;
}
#table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #0e5071;
  color: white;
}
.button-section {
  display: flex;
  justify-content: space-between;
}

.button-section button {
  margin: 10px 0 0 0;
  width: 48%;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
