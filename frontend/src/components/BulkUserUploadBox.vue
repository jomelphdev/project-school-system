<script setup>
import ButtonSubmit from "./ButtonSubmit.vue";
import DescriptionInline from "./DescriptionInline.vue";
import DropDownInfo from "./DropDownInfo.vue";
import api from "../api/api";
import FileUploader from "./FileUploader.vue";
import Multiselect from "@vueform/multiselect";
import Swal from "sweetalert2";
import BulkUserUploadReports from "./BulkUserUploadReports.vue";
import CryptoJS from "crypto-js";
import { flashMessage } from "../functions.js";
</script>

<template>
  <div>
    <div>
      <form @submit.prevent="swalValidation" method="post">
        <div v-if="passedUserData.roles.includes('16')">
          <label style="color: #ccc" for="selectOrganisation"
            ><DescriptionInline label="Select organisation "
          /></label>
          <select
            class="input"
            id="selectOrganisation"
            name="organization"
            v-model="userDetails.org_id"
            required
          >
            <option :value="null" selected>Select Organisation</option>
            <option
              v-for="org in userOrg"
              v-bind:key="org.org_id"
              v-bind:value="org.org_id"
            >
              {{ org.org_name }}
            </option>
          </select>
        </div>

        <div v-else>
          <label style="color: #ccc" for="organization"
            ><DescriptionInline label="Your organization"
          /></label>
          <p id="organization">{{ userOrgName }}</p>
        </div>

        <label style="color: #ccc" for="selectSubOrganisation"
          ><DescriptionInline label="Select sub-organisation "
        /></label>
        <Multiselect
          v-model="userDetails.suborgs"
          class="input1"
          placeholder="Select sub-organization"
          :searchable="true"
          :options="filteredSubOrg"
        />

        <label style="color: #ccc" for="selectProgram"
          ><DescriptionInline label="Select Program" />
        </label>
        <Multiselect
          v-model="userDetails.indGroup.program_id"
          class="input1"
          placeholder="Select/Add program"
          :searchable="true"
          :options="filteredProgram"
          :createOption="true"
        />

        <label style="color: #ccc" for="selectIteration"
          ><DescriptionInline label="Select Iteration" />
        </label>
        <Multiselect
          v-model="userDetails.indGroup.iteration_id"
          class="input1"
          placeholder="Select/Add iteration"
          :searchable="true"
          :options="filteredIteration"
          :createOption="true"
        />

        <br />
        <br />

        <input
          type="radio"
          id="email-notif"
          name="emailNotif"
          v-model="emailNotif"
          value="true"
        />
        <label for="email-notif">Send Email Notification</label><br />

        <div v-if="emailNotif" class="radio-btn">
          <input
            type="radio"
            id="date-now"
            name="initiation_date"
            :value="currentDate.toISOString().slice(0, -8)"
            v-model="userDetails.initiation_date"
            @click="hideCalendar"
          />
          <label for="date-now">Now</label><br />

          <input
            type="radio"
            id="later-date"
            name="initiation_date"
            value="true"
            v-model="sendLater"
            @click="clearDate"
          />
          <label for="later-date" style="margin-right: 5px">Later</label>

          <input
            v-if="sendLater"
            type="datetime-local"
            id="launch"
            v-model="userDetails.initiation_date"
            @input="initiation = $event.target.value"
          />
        </div>

        <br />
        <br />

        <FileUploader
          :onSubmit="onFileSubmit"
          :key="renderComponent"
          ref="file"
        />
        <br />
        <br />

        <ButtonSubmit
          type="submit"
          value="Submit"
          :label="buttonLabel"
          :disabled="disable == true"
        />
        <br /><br />
      </form>
    </div>

    <BulkUserUploadReports
      :passParseData="passParseData"
      :existingEmailData="existingEmailData"
    />
    <ButtonSubmit
      label="Upload Again"
      v-show="toggle == false"
      @click="resetComponent"
    />
  </div>
</template>

<script>
export default {
  name: "BulkUploadUserBox",
  component: [
    DescriptionInline,
    DropDownInfo,
    FileUploader,
    ButtonSubmit,
    Multiselect,
    BulkUserUploadReports,
  ],
  props: ["buttonLabel", "passedUserData", "brandData"],

  data: () => ({
    renderComponent: 0,
    toggle: true,
    disable: false,
    mode: "tags",
    closeOnSelect: false,
    searchable: true,
    file: null,
    formData: "",
    timezone: "Select time-zone",
    userOrg: [],
    userSubOrg: [],
    userRoles: {},
    newRoleId: "",
    csvRole: "",
    suborgOptions: [],
    userIterations: [],
    userPrograms: [],
    statement: [],
    userData: [],
    userOrgName: "",
    parseData: [],
    passParseData: [],
    existingEmailData: [],
    currentDate: new Date(),
    emailNotif: false,
    sendLater: false,
    userDetails: {
      org_id: null,
      suborgs: [],
      initiation_date: null,
      auth_string: "",
      seed: "",
      program: {
        program_name: "",
        org_id: null,
        suborg_id: null,
        created_by: "1",
        modified_by: "1",
      },
      iteration: {
        iteration_name: "",
        org_id: null,
        suborg_id: null,
        program_id: null,
        created_by: "1",
        modified_by: "1",
      },
      indGroup: {
        ind_id: null,
        program_id: null,
        iteration_id: null,
        org_id: null,
        suborg_id: null,
        created_by: "1",
        modified_by: "1",
      },
    },
    userAuthStringResult:
      "000000000000000000000000000000000000000000000000000000000000", // 59 items
    userAuthString: {
      Participant:
        "111111111100000000000000000000000000000000000000000000000000",
      Respondent: "111111111100000000000000000000000000000000000000000000000000",
      SurveyPreviewer:
        "111111111100100000000000000000000000000000000000000001000000",
      Coach: "111111111100010000000001000111111111111111111111000001000000",
      FacultyViewer:
        "111111111100000000000000000111111011111111111110000001000000",
      HRProfessionalViewer:
        "111111111100000000000000000111111111111111111110000001000000",
      ClientAdministratorViewer:
        "111111111100000000000000000111111011111111111110000001000010", //59th item client admin dashboard
      ClientAdministratorEditor:
        "111111111100111111111111111111111011111111111111001001000000",
      ClientEmailTemplateEditor:
        "111111111110111111111111111111111011111111111111001001000000",
      CXM: "111111111100111111111110001111111011111111111111001001000000",
      MasterAdministrator:
        "111111111100111111111111111111111111111111111111111001000000",
      MasterAdministratorEmails:
        "111111111110111111111111111111111111111111111111111001000000",
      SubOrgManager:
        "111111111110111111111111111111111111111111111111111101000100", //58th item is brand screen
      AnnouncementManager:
        "111111111111111111111111111111111111111111111111111101000100",
      SiteManager:
        "100000000000011000000000100000000000000000000000000010100001", //59th item survey-builder
      SurveyCreator:
        "100000000000000000000000000000000000000000000000000000010001",
      SurveyManager:
        "100000000000000000000000000000000000000000000000000000011001", //56th item is csv parser, 57th item is manage survey
    },
  }),
  async mounted() {
    if (this.passedUserData != "undefined" || this.passedUserData != null) {
      if (this.passedUserData.roles.includes("16")) {
        await api
          .get("individuals/" + this.passedUserData.ind_id)
          .then((result) => {
            this.userOrgName = result.data.org_name;
          });
      } else {
        await api
          .get("individuals/" + this.passedUserData.ind_id)
          .then((result) => {
            this.userOrgName = result.data.org_name;
            this.userDetails.org_id = this.passedUserData.org_id;
          });
      }
    }

    await this.renderDataAgain();

    await api.get("organizations").then((result) => {
      this.userOrg = result.data.sort((a, b) =>
        a.org_name.localeCompare(b.org_name)
      );
    });

    await api.get("roles/").then((result) => {
      this.userRoles = result.data;
    });

    await api.get("sub-organizations/").then((result) => {
      this.userSubOrg = result.data;
    });
  },
  methods: {
    randomString(length, chars) {
      var result = "";
      for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
      return result;
    },
    encrypt(src, passphrase) {
      return CryptoJS.AES.encrypt(src, passphrase).toString();
    },
    clearDate() {
      this.userDetails.initiation_date = "";
    },

    async renderDataAgain() {
      await api.get("individuals").then((result) => {
        this.userData = result.data;
      });

      await api.get("iterations").then((result) => {
        this.userIterations = result.data;
      });

      await api.get("programs").then((result) => {
        this.userPrograms = result.data;
      });
    },

    resetComponent() {
      // Remove my-component from the DOM
      if (this.passedUserData.roles.includes("16")) {
        this.userDetails.org_id = null;
      }
      this.userDetails.suborgs = [];
      this.toggle = true;
      this.passParseData = [];
      this.existingEmailData = [];
      this.renderDataAgain();
      this.renderComponent = 0;
      this.disable = false;
    },

    hideCalendar() {
      this.sendLater = false;
    },

    onFileSubmit: async function (file) {

      const reader = new FileReader();

      reader.readAsText(file);

      reader.onload = () => {
        this.file = reader.result;
      };

      reader.onerror = () => {};
    },

    swalValidation() {
      if (
        this.userDetails.indGroup.program_id == null &&
        this.userDetails.indGroup.iteration_id == null
      ) {
        try {
          Swal.fire({
            text: `Are you sure you want to leave program and iteration blank?`,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes",
          }).then((result) => {
            if (result.isConfirmed) {
              var vm = this;
              this.$papa.parse(this.file, {
                header: true,
                delimiter: ",",
                skipEmptyLines: true,
                complete: function (results) {
                  vm.passParseData = results.data;
                  const parseData = results.data;
                  const tempEmails = vm.userData.map((x) =>
                    x.email.toLowerCase()
                  );
                  vm.parseData = parseData.filter(
                    (x) => !tempEmails.includes(x.email.toLowerCase())
                  );
                  vm.existingEmailData = parseData.filter((x) =>
                    tempEmails.includes(x.email.toLowerCase())
                  );

                },
              });
              vm.handleSubmit();
            }
          });
        } catch (error) {
          console.error(error);
        }
      } else if (
        this.userDetails.indGroup.program_id != null &&
        this.userDetails.indGroup.iteration_id == null
      ) {
        try {
          Swal.fire({
            text: `Are you sure you want to leave iteration blank?`,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes",
          }).then((result) => {
            if (result.isConfirmed) {
              var vm = this;
              this.$papa.parse(this.file, {
                header: true,
                delimiter: ",",
                skipEmptyLines: true,
                complete: function (results) {
                  vm.passParseData = results.data;
                  const parseData = results.data;
                  const tempEmails = vm.userData.map((x) =>
                    x.email.toLowerCase()
                  );
                  vm.parseData = parseData.filter(
                    (x) => !tempEmails.includes(x.email.toLowerCase())
                  );
                  vm.existingEmailData = parseData.filter((x) =>
                    tempEmails.includes(x.email.toLowerCase())
                  );
                },
              });
              vm.handleSubmit();
            }
          });
        } catch (error) {
          console.error(error);
        }
      } else if (
        this.userDetails.indGroup.program_id == null &&
        this.userDetails.indGroup.iteration_id != null
      ) {
        try {
          Swal.fire({
            text: `You cannot leave program blank.`,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              this.userDetails.indGroup.iteration_id = null;
            }
          });
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          var vm = this;
          this.$papa.parse(this.file, {
            header: true,
            delimiter: ",",
            skipEmptyLines: true,
            complete: function (results) {
              vm.passParseData = results.data;
              const parseData = results.data;
              const tempEmails = vm.userData.map((x) => x.email.toLowerCase());
              vm.parseData = parseData.filter(
                (x) => !tempEmails.includes(x.email.toLowerCase())
              );
              vm.existingEmailData = parseData.filter((x) =>
                tempEmails.includes(x.email.toLowerCase())
              );
            },
          });
          vm.handleSubmit();
        } catch (error) {
          console.error(error);
        }
      }
    },

    handleSubmit() {
      try {
        var userDetails = this.userDetails;
        var indGroup = this.userDetails.indGroup;
        var userAuthStringResult = this.userAuthStringResult;
        var userAuthString = this.userAuthString;
        var newRoleId = this.newRoleId;
        var userRoles = this.userRoles;
        const data = this.parseData;
        for (var j = 0; j < data.length; j++) {
          this.userDetails.seed = this.randomString(
            32,
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
          );
          if (data[j].role.toLowerCase() == "participant") {
            const sourceStr = userAuthString.Participant;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "respondent") {
            const sourceStr = userAuthString.Respondent;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "survey previewer") {
            const sourceStr = userAuthString.SurveyPreviewer;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "coach") {
            const sourceStr = userAuthString.Coach;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "faculty viewer") {
            const sourceStr = userAuthString.FacultyViewer;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "hr professional viewer") {
            const sourceStr = userAuthString.HRProfessionalViewer;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "client administrator viewer") {
            const sourceStr = userAuthString.ClientAdministratorViewer;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "client adminsitrator editor") {
            const sourceStr = userAuthString.ClientAdministratorEditor;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "client email template") {
            const sourceStr = userAuthString.ClientEmailTemplateEditor;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "cxm") {
            const sourceStr = userAuthString.CXM;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "master administrator") {
            const sourceStr = userAuthString.MasterAdministrator;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "master administrator - emails") {
            const sourceStr = userAuthString.MasterAdministratorEmails;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "sub org manager") {
            const sourceStr = userAuthString.SubOrgManager;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "announcement manager") {
            const sourceStr = userAuthString.AnnouncementManager;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "site manager") {
            const sourceStr = userAuthString.SiteManager;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "survey creator") {
            const sourceStr = userAuthString.SurveyCreator;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role.toLowerCase() == "survey manager") {
            const sourceStr = userAuthString.SurveyManager;
            const searchStr = "1";
            const indexes = [
              ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
            ].map((a) => a.index);
            for (let i = 0; i < indexes.length; i++) {
              const str = userAuthStringResult;
              const replacement = "1";
              const replaced =
                str.substring(indexes[0], indexes[i]) +
                replacement +
                str.substring(indexes[i] + 1);
              userAuthStringResult = replaced;
            }
          }
          if (data[j].role == null) {
            userAuthStringResult =
              "000000000000000000000000000000000000000000000000000000000";
          }
          userDetails.auth_string = this.encrypt(
            userAuthStringResult,
            userDetails.seed
          );

          userRoles.map((roles) => {
            if (data[j].role.toLowerCase() == roles.role_name.toLowerCase()) {
              newRoleId = roles.role_id;
            }
          });

          if (indGroup.program_id == null) {
            api
              .post("individuals/", {
                email: data[j].email,
                first_name: data[j].first_name,
                last_name: data[j].last_name,
                auth_string: userDetails.auth_string,
                seed: userDetails.seed,
                suppress_email_sending: 0,
                is_participant: 1,
                org_id: userDetails.org_id,
                suborgs: userDetails.suborgs,
                roles: newRoleId,
                initiation_date: userDetails.initiation_date,
                created_by: "1",
                modified_by: "1",
                indGroup: {
                  program_id: indGroup.program_id,
                  iteration_id: indGroup.iteration_id,
                  org_id: userDetails.org_id,
                  suborg_id: userDetails.suborgs,
                  created_by: indGroup.created_by,
                  modified_by: indGroup.modified_by,
                },
              })
              .then(() => {
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color
                    ? this.brandData.flash_text_color
                    : "#ffffff",
                  "Uploading all " +
                    data.length +
                    " user(s), Please wait for this message to be gone."
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
              .post("individuals-and-program/", {
                email: data[j].email,
                first_name: data[j].first_name,
                last_name: data[j].last_name,
                auth_string: userDetails.auth_string,
                seed: userDetails.seed,
                suppress_email_sending: 0,
                is_participant: 1,
                org_id: userDetails.org_id,
                suborgs: userDetails.suborgs,
                roles: newRoleId,
                initiation_date: userDetails.initiation_date,
                created_by: "1",
                modified_by: "1",
                program: {
                  program_name: indGroup.program_id,
                  org_id: userDetails.org_id,
                  suborg_id: userDetails.suborgs,
                  created_by: indGroup.created_by,
                  modified_by: indGroup.modified_by,
                },
                iteration: {
                  iteration_name: indGroup.iteration_id,
                  org_id: userDetails.org_id,
                  suborg_id: userDetails.suborgs,
                  created_by: "1",
                  modified_by: "1",
                },
                indGroup: {
                  org_id: userDetails.org_id,
                  suborg_id: userDetails.suborgs,
                  created_by: indGroup.created_by,
                  modified_by: indGroup.modified_by,
                },
              })
              .then(() => {
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color
                    ? this.brandData.flash_text_color
                    : "#ffffff",
                  "Uploading all " +
                    data.length +
                    " user(s), Please wait for this message to be gone."
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
        this.$forceUpdate();
      } catch (error) {
        console.log(error);
      }
      this.userDetails.indGroup.program_id = null;
      this.userDetails.indGroup.iteration_id = null;
      this.emailNotif = false;
      this.userDetails.initiation_date = null;
      this.sendLater = false;
      this.toggle = false;
      this.disable = true;
      this.renderComponent++;
    },
  },

  computed: {
    mapSubOrg: function () {
      return this.userSubOrg
        .sort((a, b) => a.suborg_name.localeCompare(b.suborg_name))
        .map(function (el) {
          if (
            this.userDetails.org_id != "" ||
            this.userDetails.org_id != undefined ||
            this.userDetails.org_id !== null
          ) {
            if (this.userDetails.org_id == el.org_id) {
              if (el.suborg_id != undefined || el.suborg_name != undefined) {
                return { value: el.suborg_id, label: el.suborg_name };
              }
            }
          }
        }, this);
    },

    filteredSubOrg: function () {
      return this.mapSubOrg.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    mapProgram: function () {
      return this.userPrograms
        .sort((a, b) => a.program_name.localeCompare(b.program_name))
        .map(function (el) {
          if (
            this.userDetails.org_id != "" ||
            this.userDetails.org_id != undefined ||
            this.userDetails.org_id !== null
          ) {
            if (
              this.userDetails.org_id == el.org_id &&
              this.userDetails.suborgs == el.suborg_id
            ) {
              if (el.program_id != undefined || el.program_name != undefined) {
                return { value: el.program_id, label: el.program_name };
              }
            }
          } else {
            return "";
          }
        }, this);
    },

    filteredProgram: function () {
      return this.mapProgram.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    mapIteration: function () {
      return this.userIterations
        .sort((a, b) => a.iteration_name.localeCompare(b.iteration_name))
        .map(function (el) {
          if (
            this.userDetails.org_id != "" ||
            this.userDetails.org_id != undefined ||
            this.userDetails.org_id !== null
          ) {
            if (
              this.userDetails.org_id == el.org_id &&
              this.userDetails.suborgs == el.suborg_id &&
              this.userDetails.indGroup.program_id == el.program_id
            ) {
              if (
                el.iteration_id != undefined ||
                el.iteration_name != undefined
              ) {
                return { value: el.iteration_id, label: el.iteration_name };
              }
            }
          } else {
            return "";
          }
        }, this);
    },

    filteredIteration: function () {
      return this.mapIteration.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    // filteredData: function () {
    //   return this.userData.filter(function (el) {
    //     console.log(el)
    //     if (this.userDetails.email != "") {
    //       return el.email == this.userDetails.email
    //     }
    //     console.log(el)
    //   }, this);
    // },
  },
};
</script>

<style scoped>
.radio-btn {
  margin-top: 5px;
}
.radio-btn input {
  margin-left: 20px;
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
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
