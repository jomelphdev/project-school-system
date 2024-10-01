<script setup>
import DescriptionInline from "./DescriptionInline.vue";
import Description from "./Description.vue";
import DropDownInfo from "./DropDownInfo.vue";
import DropDownInfoNumbered from "./DropDownInfoNumbered.vue";
import HeaderReport from "./HeaderReport.vue";
import FieldNameInline from "./FieldNameInline.vue";
import ButtonSubmit from "./ButtonSubmit.vue";
import api from "../api/api";
import Multiselect from "@vueform/multiselect";
import { flashMessage } from "../functions.js";
</script>

<template>
  <div class="main-div">
    <form>
      <div
        style="
          display: block;
          flex-direction: column;
          justify-content: space-between;
          flex-wrap: wrap;
        "
      >
        <div v-if="userData.roles.includes('16')">
          <label style="color: #ccc" for="selectOrg"
            ><DescriptionInline label="Select Organization" />
          </label>
          <select
            class="input1"
            name="organization"
            id="organization"
            v-model="organization"
            value="default"
          >
            <option :value="null" selected>Select Organization</option>
            <option
              v-for="org in userOrg"
              v-bind:key="org.org_id"
              v-bind:value="org.org_id"
            >
              {{ org.org_name }}
            </option>
          </select>
        </div>

        <div v-else class="org-label">
          <Description label="Your organization is:"></Description>
          <p>{{ displayOrg }}</p>
        </div>

        <!-- <label style="color: #ccc" for="selectOrganisation"
          ><DescriptionInline label="Select organisation "
        /></label>
        <select
          class="input"
          id="selectOrganisation"
          name="org"
          v-model="organization"
        >
          <option :value="null" selected>Select Organisation</option>
          <option
            v-for="org in userOrg"
            v-bind:key="org.org_id"
            v-bind:value="org.org_id"
          >
            {{ org.org_name }}
          </option>
        </select> -->

        <label style="color: #ccc" for="selectSubOrganisation"
          ><DescriptionInline label="Select sub-organisation "
        /></label>
        <Multiselect
          v-model="sub_organization"
          class="input1"
          placeholder="Select sub-organization"
          :searchable="true"
          :options="filteredSubOrg"
        />

        <label style="color: #ccc" for="selectRoles"
          ><DescriptionInline label="Select roles "
        /></label>
        <Multiselect
          v-model="roles"
          class="input1"
          placeholder="Select Roles"
          :searchable="true"
          :options="roleOptions"
        />

        <br />
        <br />

        <ButtonSubmit label="Apply Filter" @click.prevent="searchResult" />
        <br />
        <br />
        <div v-if="filteredData != []">
          <table id="table">
            <tr>
              <th v-for="head in table_headers" :key="head">
                <a
                  @click="sort(head)"
                  :class="{ active: sortBy == head }"
                  style="display: flex; flex-direction: row; cursor: pointer"
                >
                  {{
                    head == "full_name"
                      ? "Name"
                      : head == "email"
                      ? "Email"
                      : head == "suborgs"
                      ? "Sub-organizations"
                      : head == "roles"
                      ? "Roles"
                      : head == "created_at"
                      ? "Created"
                      : head == "last_login_date"
                      ? "Last Login"
                      : null
                  }}

                  <div class="sort-icon" v-if="sortBy == head">
                    <a v-if="sortDirection == 1">
                      <i class="fa-solid fa-sort-up"></i
                    ></a>
                    <a v-else> <i class="fa-solid fa-sort-down"></i></a>
                  </div>
                </a>
              </th>
              <th>Actions</th>
            </tr>
            <tr
              v-for="data in sortedProperties"
              :key="data"
              :value="data"
              style="cursor: pointer"
              @click="selectUser(data)"
              :class="{ activeRow: active_el == data }"
            >
              <td v-for="head in table_headers" :key="head">
                {{
                  head == "full_name"
                    ? data[head]
                    : head == "email"
                    ? data[head]
                    : head == "suborgs"
                    ? getSuborg(data[head])
                    : head == "roles"
                    ? getRoles(data[head])
                    : head == "created_at"
                    ? readDate(data[head])
                    : head == "last_login_date"
                    ? readDate(data[head])
                    : data[head]
                }}
              </td>
              <td>
                <button @click="sendProps(data)" class="td-btn">
                  Edit
                  <i class="fa-regular fa-edit" aria-hidden="true"></i>
                </button>
                <button @click.prevent="selectUser(data)" class="td-btn">
                  View
                  <i class="fa-regular fa-eye" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
          </table>
        </div>
        <div v-if="Object.keys(selectedUser).length != 0">
          <strong><p>User information</p></strong>

          <strong><span>Email:</span></strong>
          <span>&nbsp;&nbsp;{{ selectedUser.email }}</span>
          <br />
          <div>
            <strong><span>Program:</span></strong>
            <span>&nbsp;&nbsp;{{ selectedUserDetails.user_program }}</span>
          </div>
          <div>
            <strong><span>Iteration:</span></strong>
            <span>&nbsp;&nbsp;{{ selectedUserDetails.user_iteration }}</span>
          </div>
          <div>
            <strong><span>Stream:</span></strong>
            <span>&nbsp;&nbsp;{{ selectedUserDetails.user_stream }}</span>
          </div>
          <div>
            <strong><span>Group:</span></strong>
            <span>&nbsp;&nbsp;{{ selectedUserDetails.user_group }}</span>
          </div>
        </div>
        <div v-else></div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "ElevatedUsersBox",
  component: [
    DescriptionInline,
    DropDownInfo,
    DropDownInfoNumbered,
    HeaderReport,
    FieldNameInline,
    ButtonSubmit,
    Multiselect,
    Description,
  ],
  props: ["buttonLabel", "brandData", "userData"],

  data: () => ({
    mode: "tags",
    table_headers: [
      "full_name",
      "email",
      "suborgs",
      "roles",
      "created_at",
      "last_login_date",
    ],
    displayOrg: "",
    closeOnSelect: false,
    mappingRoles: [],
    suborgOptions: [],
    searchable: true,
    organization: null,
    sub_organization: [],
    userOrg: [],
    userSubOrg: [],
    roles: [],
    filteredData: [],
    fetchedData: [],
    suborgData: [],
    newNameSuborg: [],
    roleData: [],
    selectedUser: {},
    newName: "",
    sortBy: "",
    sortDirection: 1,
    selectedUserDetails: {},
    active_el: 0,
  }),

  async mounted() {
    await api.get("individuals/" + this.userData.ind_id).then((result) => {
      this.displayOrg = result.data.org_name;
    });

    if (!this.userData.roles.includes("16")) {
      await api
        .get(`individuals/org/${this.userData.org_id}`)
        .then((result) => {
          this.fetchedData = result.data;
          this.organization = this.userData.org_id;
          this.fetchedData.sort((a, b) => a.email.localeCompare(b.email));
        });
    } else {
      await api.get(`individuals`).then((result) => {
        this.fetchedData = result.data;
        this.fetchedData.sort((a, b) => a.email.localeCompare(b.email));
      });
    }

    await api.get("organizations").then((result) => {
      this.userOrg = result.data;
    });

    await api.get("sub-organizations/").then((result) => {
      this.userSubOrg = result.data.sort((a, b) =>
        a.suborg_name.localeCompare(b.suborg_name)
      );
      this.suborgOptions = result.data.map((suborg) => {
        return { value: suborg.suborg_name, label: suborg.suborg_name };
      });
    });

    await api.get("roles").then((result) => {
      this.roleData = result.data;
      this.mappingRoles = result.data
        .sort((a, b) => a.role_name.localeCompare(b.role_name))
        .map((role) => {
          if (role.role_id != 1 && role.role_id != 2)
            return { value: role.role_name, label: role.role_name };
        });
    });
  },

  methods: {
    sendProps(data) {
      this.$router.push({
        name: "CreateEditUserBox",
        params: { data: JSON.stringify(data) },
      });
    },

    async selectUser(user) {
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

    async sort(head) {
      this.sortBy = head;
      this.sortDirection *= -1;
    },

    dynamicSort(property, direction) {
      if (property[0] === "-") {
        property = property.substr(1);
      }
      return function (a, b) {
        var result =
          a[property] < b[property] ? 1 : a[property] > b[property] ? -1 : 0;
        return result * direction;
      };
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

    getSuborg(data) {
      var newValue = data.split(", ");
      if (
        newValue != 0 &&
        newValue != null &&
        newValue != undefined &&
        newValue != ""
      ) {
        var newName = newValue.map(
          (r) => this.userSubOrg.find((f) => f.suborg_id == r).suborg_name
        );
        return newName.join(", ");
      }
    },

    getRoles(data) {
      var newValue = data.split(", ");
      var newName = newValue.map(
        (r) => this.roleData.find((f) => f.role_id == r).role_name
      );
      return newName.join(", ");
    },

    async searchResult() {
      this.filteredData = this.fetchedData.filter((data) => {
        var multiRole = this.roles;
        var multiSuborg = this.sub_organization;

        var newValueRole = data.roles.split(", ");
        var roleName = newValueRole.map(
          (r) => this.roleData.find((f) => f.role_id == r).role_name
        );

        if (
          data.suborgs != 0 &&
          data.suborgs != null &&
          data.suborgs != undefined &&
          data.suborgs != ""
        ) {
          var newValueSuborg = data.suborgs.split(", ");
          this.newNameSuborg = newValueSuborg.map(
            (r) => this.userSubOrg.find((f) => f.suborg_id == r).suborg_name
          );
        }

        var joinSuborg = this.newNameSuborg.join(", ");
        var joinName = roleName.join(", ");

        // console.log(this.newValueSuborg);
        // console.log(newValueRole);
        // console.log(multiRole);
        // console.log(multiSuborg);

        if (this.selectedUser.length != 0) {
          this.selectedUser = {};
          this.active_el = 0;
        }
        return (
          data.org_id == this.organization &&
          joinName.toLowerCase().includes(multiRole.toLowerCase()) &&
          joinSuborg.toLowerCase().includes(multiSuborg.toLowerCase())
        );

        // return (this.contains(roleName, multiRole) && this.contains(this.newNameSuborg, multiSuborg))
        // return (this.contains(multiRole, roleName) && this.contains(multiSuborg,this.newNameSuborg))
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
    },
    async sendToSurvey(user) {
      this.$router.push({
        name: "Add_survey",
        params: { data: JSON.stringify(user) },
      });
    },

    contains(target, pattern) {
      var value = 0;
      pattern.forEach(function (word) {
        value = value + target.includes(word);
      });
      return value === 1;
    },
  },

  computed: {
    mapSubOrg: function () {
      return this.userSubOrg
        .sort((a, b) => a.suborg_name.localeCompare(b.suborg_name))
        .map(function (el) {
          if (this.userData.org_id == el.org_id) {
            return { value: el.suborg_name, label: el.suborg_name };
          }
        }, this);
    },

    filteredSubOrg: function () {
      return this.mapSubOrg.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    roleOptions: function () {
      return this.mappingRoles.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    sortedProperties() {
      const direction = this.sortDirection;
      const head = this.sortBy;
      return this.filteredData.sort(this.dynamicSort(head, direction));
    },
  },
};
</script>

<style scoped>
.main-div {
  width: 100%;
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
  border-top: 4px solid rgb(185, 22, 10);
  text-align: left;
  font: -webkit-control;
  margin: 0 10px;
  min-height: 10px;
  padding: 10px;
  max-width: 100%;
}
.btn {
  width: 100%;
  background-color: #e67829;
  border: 1px solid #ccc;
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
.btnFit {
  min-width: 40px;
  background-color: #e67829;
  color: white;
  border: 10px;
  padding: 10px 10px;
  margin: 10px 10px;
  border: 1px solid #ccc;
}

.btnFitWhite {
  min-width: 40px;
  background-color: white;
  color: black;
  border: 10px;
  padding: 10px 10px;
  margin: 10px 10px;
  border: 1px solid #ccc;
}

#table {
  /* border-collapse: collapse; */
  width: 100%;
  word-break: break-all;
  table-layout: fixed;
}

#table td,
#table th {
  border: 3px solid #ddd;
  padding: 8px;
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

.active {
  color: #f47820;
}
.activeRow {
  background-color: #32bfb8 !important;
}
.td-btn {
  margin: 5px;
  cursor: pointer;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
