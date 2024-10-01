<script setup>
import DescriptionInline from "./DescriptionInline.vue";
import api from "../api/api";
import ButtonSubmit from "./ButtonSubmit.vue";
import Multiselect from "@vueform/multiselect";
import CryptoJS from "crypto-js";
import Description from "./Description.vue";
import { flashMessage, replaceTokens, mailFormat } from "../functions.js";
import Swal from "sweetalert2";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
</script>

<template>
  <div class="box">
    <form
      @submit.prevent="swalValidation"
      method="post"
      v-if="passedDetails == ''"
    >
      <h1>Add User</h1>

      <div class="org-label" v-if="!userData.roles.includes('16')">
        <Description label="Your organization is:"></Description>
        <p>{{ userOrgName }}</p>
      </div>

      <input
        v-model="userDetails.email"
        placeholder="Email*"
        class="input1"
        type="email"
        required
      />
      <br />

      <input
        type="checkbox"
        id="checkbox"
        v-model="userDetails.suppress_email_sending"
        true-value="1"
      />
      <label for="checkbox"
        ><DescriptionInline label="Suppress email sending"
      /></label>
      <p>
        If emails are suppressed for a user, we will never email them. This is
        switched on automatically if the user complains or we detect a bounce.
      </p>
      <br />
      <input
        v-model="userDetails.first_name"
        class="input1"
        placeholder="First Name*"
        required
      />
      <br />
      <input
        v-model="userDetails.last_name"
        class="input1"
        placeholder="Last Name*"
        required
      />
      <br />
      <br />

      <vue-tel-input
        v-model="userDetails.phone_number"
        v-bind="bindProps"
      ></vue-tel-input>
      <br />

      <div v-if="userData.roles.includes('16')">
        <label style="color: #ccc" for="selectOrg"
          ><DescriptionInline label="Select Organization" />
        </label>
        <select
          class="input1"
          name="organization"
          id="organization"
          v-model="userDetails.org_id"
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

      <div v-if="userDetails.org_id == ''"></div>
      <div v-else>
        <label style="color: #ccc" for="selectSubOrganisation"
          ><DescriptionInline label="Select sub-organisation "
        /></label>
        <Multiselect
          v-model="userDetails.suborgs"
          class="input1"
          placeholder="Select sub-organization"
          mode="tags"
          :searchable="true"
          :options="filteredSubOrg"
          @change="selectedSuborg($event)"
        />
      </div>

      <label style="color: #ccc" for="selectRole"
        ><DescriptionInline label="Add Role" />
      </label>
      <Multiselect
        v-model="userDetails.roles"
        class="input1"
        placeholder="Add Roles"
        mode="tags"
        :searchable="true"
        :options="rolesOptions"
        :allow-empty="false"
      />

      <label style="color: #ccc" for="selectProgram"
        ><DescriptionInline label="Select Program" />
      </label>
      <select
        class="input1"
        name="program"
        id="program"
        v-model="userDetails.indGroup.program_id"
        value="default"
      >
        <option :value="null" selected>Select Program</option>
        <option
          v-for="program in filteredProgram"
          v-bind:key="program.program_id"
          v-bind:value="program.program_id"
        >
          {{ program.program_name }}
        </option>
      </select>

      <br />

      <label style="color: #ccc" for="selectIteration"
        ><DescriptionInline label="Select Iteration" />
      </label>
      <select
        class="input1"
        name="iteration"
        id="iteration"
        v-model="userDetails.indGroup.iteration_id"
        value="default"
      >
        <option :value="null" selected>Select Iteration</option>
        <option
          v-for="iteration in filteredIteration"
          v-bind:key="iteration.iteration_id"
          v-bind:value="iteration.iteration_id"
        >
          {{ iteration.iteration_name }}
        </option>
      </select>

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
          class="input"
          type="datetime-local"
          id="launch"
          v-model="userDetails.initiation_date"
          @input="initiation = $event.target.value"
        />
      </div>

      <br />
      <br />
      <ButtonSubmit label="Add" type="submit" />
    </form>

    <form @submit.prevent="handleUpdate" method="put" v-else>
      <h1>Edit User</h1>

      <br />
      <div class="org-label" v-if="!userData.roles.includes('16')">
        <Description label="Your organization is:"></Description>
        <p>{{ passedOrgName }}</p>
      </div>

      <label style="color: #ccc" for="email"
        ><DescriptionInline label="Update Email" />
      </label>
      <input
        v-model="userDetails.email"
        :placeholder="passedDetails.email"
        class="input1"
        required
        type="email"
      />
      <br />

      <input
        type="checkbox"
        id="checkbox"
        v-model="userDetails.suppress_email_sending"
        true-value="1"
      />
      <label for="checkbox"
        ><DescriptionInline label="Suppress email sending"
      /></label>
      <p>
        If emails are suppressed for a user, we will never email them. This is
        switched on automatically if the user complains or we detect a bounce.
      </p>
      <br />
      <label style="color: #ccc" for="first_name"
        ><DescriptionInline label="Update First Name" />
      </label>
      <input
        v-model="userDetails.first_name"
        class="input1"
        :placeholder="passedDetails.first_name"
        required
      />
      <br />
      <label style="color: #ccc" for="last_name"
        ><DescriptionInline label="Update Last Name" />
      </label>
      <input
        v-model="userDetails.last_name"
        class="input1"
        :placeholder="passedDetails.last_name"
        required
      />
      <br />
      <label style="color: #ccc" for="phone_number"
        ><DescriptionInline label="Update Phone Number" />
      </label>
      <br />
      <br />

      <vue-tel-input
        v-model="userDetails.phone_number"
        v-bind="bindProps"
      ></vue-tel-input>

      <br />

      <div v-if="userData.roles.includes('16')">
        <label style="color: #ccc" for="selectOrg"
          ><DescriptionInline label="Select Organization" />
        </label>
        <select
          class="input1"
          name="organization"
          id="organization"
          v-model="userDetails.org_id"
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

      <br />

      <div>
        <label style="color: #ccc" for="selectSubOrganisation"
          ><DescriptionInline label="Update sub-organisation "
        /></label>
        <Multiselect
          v-model="userDetails.suborgs"
          class="input1"
          placeholder="Update sub-organization"
          mode="tags"
          :searchable="true"
          :options="filteredSubOrg"
        />
      </div>

      <br />

      <label style="color: #ccc" for="selectRole"
        ><DescriptionInline label="Update Role" />
      </label>
      <Multiselect
        v-model="userDetails.roles"
        class="input1"
        placeholder="Update Roles"
        mode="tags"
        :searchable="true"
        :options="rolesOptions"
        :allow-empty="false"
        required
      />
      <br />
      <br />
      <ButtonSubmit
        v-if="!isDisabledButton"
        :disabled="isDisabledButton"
        label="Update"
        type="submit"
      />

      <button
        v-if="isDisabledButton"
        disabled
        class="btn-disabled"
        style="display: flex; justify-content: center; align-items: center"
      >
        <clip-loader
          :loading="true"
          :color="setColor"
          :size="setSize"
        ></clip-loader>
        <span style="margin-left: 5px">Sending email...</span>
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "CreateEditUserBox",
  component: [
    DescriptionInline,
    ButtonSubmit,
    Multiselect,
    Description,
    ClipLoader,
  ],
  props: ["buttonLabel", "userData", "brandData"],

  data: () => ({
    bindProps: {
      mode: "international",
      validCharactersOnly: true,
      defaultCountry: "",
      dropDownOptions: {
        showSearchBox: true,
        width: "500px",
      },
      inputOptions: {
        showDialCode: true,
        placeholder: "Enter Phone Number*",
      },
    },
    currentDate: new Date(),
    emailNotif: false,
    sendLater: false,
    mode: "tags",
    closeOnSelect: false,
    rolesOptions: [],
    suborgOptions: [],
    searchable: true,
    passedDetails: [],
    passedOrgName: "",
    userOrg: null,
    userOrgName: "",
    userSubOrg: [],
    userIterations: [],
    userPrograms: [],
    roles: [],
    isDisabledButton: false,
    setColor: "#ff6a00",
    setSize: "10px",

    userDetails: {
      email: "",
      first_name: "",
      auth_string: "",
      password: "",
      seed: "",
      last_name: "",
      phone_number: "",
      suppress_email_sending: 0,
      is_participant: 1,
      initiation_date: null,
      org_id: "",
      suborgs: [],
      roles: [],
      created_by: "1",
      modified_by: "1",
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

    email_subject: "",
    email_body: "",
    email_template_id: "",
    email_ind_id: "",
    chosenSuborgList: [],
    finalsSuborgList: [],
    finalSuborgId: [],
    emailSiteManagerList: [],
  }),
  async mounted() {
    if (this.$route.params.data) {
      this.passedDetails = JSON.parse(this.$route.params.data);
      this.userDetails.email = this.passedDetails.email;
      this.userDetails.first_name = this.passedDetails.first_name;
      this.userDetails.last_name = this.passedDetails.last_name;
      this.userDetails.phone_number = this.passedDetails.phone_number;
      this.userDetails.seed = this.passedDetails.seed;
      this.userDetails.suppress_email_sending =
        this.passedDetails.suppress_email_sending;
      this.userDetails.org_id = this.passedDetails.org_id;
      this.userDetails.password = this.passedDetails.password;

      await api
        .get("individuals/" + this.passedDetails.ind_id)
        .then((result) => {
          this.passedOrgName = result.data.org_name;
        });

      if (this.passedDetails.roles) {
        this.userDetails.roles = this.passedDetails.roles
          .split(",")
          .map(Number);
      }

      // console.log(this.passedDetails.suborgs)
      if (this.passedDetails.suborgs) {
        this.userDetails.suborgs = this.passedDetails.suborgs
          .split(",")
          .map(Number);
      }

      await api
        .get("individuals/" + this.passedDetails.ind_id)
        .then((result) => {
          this.userOrgName = result.data.org_name;
        });
    }

    await api.get("roles").then((result) => {
      this.rolesOptions = result.data
        .sort((a, b) => a.role_name.localeCompare(b.role_name))
        .map((role) => {
          return { value: role.role_id, label: role.role_name };
        });
    });

    if (!this.userData.roles.includes("16")) {
      await api.get("individuals/" + this.userData.ind_id).then((result) => {
        this.userDetails.org_id = result.data.org_id;
        this.userOrgName = result.data.org_name;
      });
    } else {
      await api.get("individuals/" + this.userData.ind_id).then((result) => {
        this.userOrgName = result.data.org_name;
      });
    }

    await api.get("iterations").then((result) => {
      this.userIterations = result.data;
    });

    await api.get("programs").then((result) => {
      this.userPrograms = result.data;
    });

    await api.get("sub-organizations/").then((result) => {
      this.userSubOrg = result.data;
    });

    await api.get("organizations/").then((result) => {
      this.userOrg = result.data.sort((a, b) =>
        a.org_name.localeCompare(b.org_name)
      );
    });

    await api
      .get("get-sitemanager-emails/" + this.userData.org_id)
      .then((result) => {
        this.emailSiteManagerList = result.data;
        console.log(result.data);
      });
  },
  methods: {
    checkNumberInArray(arr, num) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === num) {
          return true;
        }
      }
      return false;
    },

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
      this.userDetails.initiation_date = null;
    },

    hideCalendar() {
      this.sendLater = false;
    },

    swalValidation() {
      if (!mailFormat.test(this.userDetails.email)) {
        return flashMessage(
          this.$flashMessage,
          this.brandData.accent_color1
            ? this.brandData.accent_color1
            : "#F47820",
          this.brandData.flash_text_color
            ? this.brandData.flash_text_color
            : "#ffffff",
          "Please enter a valid email address"
        );
      }

      if (this.userDetails.suborgs.length == 0) {
        return flashMessage(
          this.$flashMessage,
          this.brandData.accent_color1
            ? this.brandData.accent_color1
            : "#F47820",
          this.brandData.flash_text_color
            ? this.brandData.flash_text_color
            : "#ffffff",
          "Please select a sub-organization."
        );
      }

      if (this.userDetails.roles.length == 0) {
        return flashMessage(
          this.$flashMessage,
          this.brandData.accent_color1
            ? this.brandData.accent_color1
            : "#F47820",
          this.brandData.flash_text_color
            ? this.brandData.flash_text_color
            : "#ffffff",
          "Please select a role."
        );
      }

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
          vm.handleSubmit();
        } catch (error) {
          console.error(error);
        }
      }
    },

    async handleSubmit() {
      try {
        const res = await api.get(
          `/individuals-check-email-exist/${this.userDetails.email}`
        );
        if (res.data.message === "exist") {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            res.data.payload
          );
        } else {
          this.userDetails.seed = this.randomString(
            32,
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
          );
          this.getAuthString();
          await api
            .post("individuals/", this.userDetails)
            .then(() => {
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                "Successfully created a new User."
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

          this.chosenSuborgList.forEach((data) => {
            this.finalsSuborgList.push(data.suborg_name);
            this.finalSuborgId.push(data.suborg_id);
          });

          let suborgNames = Object.values(this.finalsSuborgList);
          let suborgId = Object.values(this.finalSuborgId);

          if (this.emailNotif !== false) {
            if (
              this.userDetails.roles.length >= 1 &&
              (this.checkNumberInArray(this.userDetails.roles, 3) ||
                this.checkNumberInArray(this.userDetails.roles, 4) ||
                this.checkNumberInArray(this.userDetails.roles, 5) ||
                this.checkNumberInArray(this.userDetails.roles, 6) ||
                this.checkNumberInArray(this.userDetails.roles, 7) ||
                this.checkNumberInArray(this.userDetails.roles, 8) ||
                this.checkNumberInArray(this.userDetails.roles, 9) ||
                this.checkNumberInArray(this.userDetails.roles, 10) ||
                this.checkNumberInArray(this.userDetails.roles, 11) ||
                this.checkNumberInArray(this.userDetails.roles, 12) ||
                this.checkNumberInArray(this.userDetails.roles, 13) ||
                this.checkNumberInArray(this.userDetails.roles, 14) ||
                this.checkNumberInArray(this.userDetails.roles, 15) ||
                this.checkNumberInArray(this.userDetails.roles, 16) ||
                this.checkNumberInArray(this.userDetails.roles, 17) ||
                this.checkNumberInArray(this.userDetails.roles, 18))
            ) {
              try {
                const res = await api.get(
                  `email-templates-make-nomination/template-type/Admin user initiation/org/${this.userDetails.org_id}/suborg/0/program/0`
                );
                if (res.status === 200) {
                  this.email_subject = res.data.payload.subject;
                  this.email_body = res.data.payload.email_body;
                  this.email_template_id = res.data.payload.email_template_id;
                }
              } catch (e) {
                console.log(e);
              }

              try {
                const res = await api.get(
                  `individuals/email/${this.userDetails.email}`
                );
                if (res.status === 200) {
                  this.email_ind_id = res.data.ind_id;
                }
              } catch (e) {
                console.log(e);
              }

              try {
                const res = await api.get(
                  `individuals/emaildetails/${this.email_ind_id}`
                );
                if (res.status === 200) {
                  this.tokens.recipient_email = res.data.email;
                  const data = {
                    result: {
                      recipient_email: res.data.email,
                      website_url: res.data.website_url,
                      nominee_salutation: res.data.nominee_salutation,
                      nominee_message: res.data.nominee_message,
                      program_name: res.data.program_name,
                      suborg_name: suborgNames.join(),
                      website_sender_email: res.data.website_sender_email,
                      website_terms_url: res.data.website_terms_url,
                      website_privacy_url: res.data.website_privacy_url,
                      website_contact_email: res.data.website_contact_email,
                      survey_close_date: res.data.survey_close_date,
                      days_until_survey_close_date:
                        res.data.days_until_survey_close_date,
                      survey_template_name: res.data.survey_template_name,
                      survey_description: res.data.survey_description,
                      user_full_name:
                        res.data.first_name + " " + res.data.last_name,
                      survey_subject_first_name:
                        res.data.survey_subject_first_name,
                      survey_subject_full_name:
                        res.data.survey_subject_full_name,
                      iteration_name: res.data.iteration_name,
                      brand_path: res.data.brand_path,
                    },
                  };

                  this.tokens = { ...data.result };

                  let encryptedID = this.encrypt(
                    this.email_ind_id.toString(),
                    "seed"
                  );
                  const password_link =
                    "<a href =" +
                    this.tokens.website_url +
                    "#/set_password?ind_id=" +
                    encodeURIComponent(encryptedID) +
                    "> Click Here </a>";

                  const convertedSubject = replaceTokens(
                    this.email_subject,
                    this.tokens,
                    password_link
                  );
                  const convertedBody = replaceTokens(
                    this.email_body,
                    this.tokens,
                    password_link
                  );

                  this.rawSubject = convertedSubject;
                  this.rawEmailBody = convertedBody;

                  const data2 = {
                    send_from: this.tokens.website_sender_email,
                    send_to: this.tokens.recipient_email,
                    send_cc: "",
                    send_bcc: "",
                    subject: this.rawSubject,
                    body: this.rawEmailBody,
                    org_id: this.userData.org_id,
                    suborg_id: suborgId.toString() ? suborgId.toString() : 0,
                    email_template_id: this.email_template_id,
                    ind_id: this.email_ind_id,
                  };

                  try {
                    const res = await api.post("sendemail", data2);
                    if (res.status === 200) {
                      this.userDetails.email = "";
                      this.userDetails.suppress_email_sending = 0;
                      this.userDetails.first_name = "";
                      this.userDetails.last_name = "";
                      this.userDetails.suborgs = [];
                      this.userDetails.roles = [];
                      this.userDetails.indGroup.program_id = null;
                      this.userDetails.indGroup.iteration_id = null;
                      this.emailNotif = false;
                      this.userDetails.initiation_date = null;
                      flashMessage(
                        this.$flashMessage,
                        this.brandData.accent_color1
                          ? this.brandData.accent_color1
                          : "#F47820",
                        this.brandData.flash_text_color
                          ? this.brandData.flash_text_color
                          : "#ffffff",
                        "Email sent Successfully"
                      );
                    }
                  } catch (e) {
                    console.log(e);
                  }
                }
              } catch (e) {
                console.log(e);
              }
            }
          }
        }
      } catch (error) {
        flashMessage(
          this.$flashMessage,
          this.brandData.accent_color1
            ? this.brandData.accent_color1
            : "#F47820",
          this.brandData.flash_text_color
            ? this.brandData.flash_text_color
            : "#ffffff",
          error.message
        );
      }

      this.userDetails.email = "";
      this.userDetails.suppress_email_sending = 0;
      this.userDetails.first_name = "";
      this.userDetails.last_name = "";
      this.userDetails.suborgs = [];
      this.userDetails.roles = [];
      this.userDetails.indGroup.program_id = null;
      this.userDetails.indGroup.iteration_id = null;
      this.emailNotif = false;
      this.userDetails.initiation_date = null;
    },

    async selectedSuborg(e) {
      try {
        const res = await api.post(`sub-organizations/add-user-email`, {
          suborg_id: e,
        });
        if (res.status === 200) {
          this.chosenSuborgList = res.data;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async handleUpdate() {
      try {
        this.isDisabledButton = true;
        this.getAuthString();

        if (this.userDetails.roles.length == 0) {
          this.isDisabledButton = false;
          return flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            "Roles is required."
          );
        }

        //update only if the roles selected is participant or respondent
        if (
          this.userDetails.roles.length <= 1 &&
          (this.checkNumberInArray(this.userDetails.roles, 1) ||
          this.checkNumberInArray(this.userDetails.roles, 2))
        ) {
          const resUpdate = await api.put(
            "individuals/" + this.passedDetails.ind_id,
            this.userDetails
          );
          if (resUpdate.status == 200) {
            api.put("survey-assignment/recipient-email/" + this.passedDetails.ind_id, this.userDetails)
            this.isDisabledButton = false;
            return flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color
                ? this.brandData.flash_text_color
                : "#ffffff",
              "Updated successfully!"
            );
          }
        } else if (
          this.userDetails.roles.length <= 2 &&
          (this.checkNumberInArray(this.userDetails.roles, 1) &&
          this.checkNumberInArray(this.userDetails.roles, 2))
        ) {
          const resUpdate = await api.put(
            "individuals/" + this.passedDetails.ind_id,
            this.userDetails
          );
          if (resUpdate.status == 200) {
            api.put("survey-assignment/recipient-email/" + this.passedDetails.ind_id, this.userDetails)
            this.isDisabledButton = false;
            return flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color
                ? this.brandData.flash_text_color
                : "#ffffff",
              "Updated successfully!"
            );
          }
        } else {
          // update user and send email
          const resUpdate = await api.put(
            "individuals/" + this.passedDetails.ind_id,
            this.userDetails
          );
          if (resUpdate.status == 200) {
            api.put("survey-assignment/recipient-email/" + this.passedDetails.ind_id, this.userDetails)
            const result = this.rolesOptions.filter(({ value }) =>
              this.userDetails.roles.includes(value)
            );
            const result2 = result.map((role) => role.label).toString();
            const sliceDate = new Date().toString();
            const emailBody = `
              <div style="background: ${
                this.brandData.header_bg_color
                  ? this.brandData.header_bg_color
                  : "#ffffff"
              }; display:flex; padding: 5px; height: 60px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);">
                <img src="${
                  this.brandData.website_url + "" + this.brandData.brand_path
                }/logo.png" alt="Brand Logo"/>
              </div>
              <p>Dear Admin,</p>
              <p>${
                this.userDetails.first_name +
                " " +
                this.userDetails.last_name +
                " has been given a role of " +
                result2 +
                " on " +
                sliceDate.slice(4, 15) +
                "."
              }</p>
              <p>Sincerely, <br/>The Admin Team</p>
            `;
            this.sendEmailToSiteManager(emailBody);
          }
        }
      } catch (error) {
        flashMessage(
          this.$flashMessage,
          this.brandData.accent_color1
            ? this.brandData.accent_color1
            : "#F47820",
          this.brandData.flash_text_color
            ? this.brandData.flash_text_color
            : "#ffffff",
          error.message
        );
      }
    },
    // for sending an email to all Site manager
    async sendEmailToSiteManager(emailBody) {
      // const all_emails = [
      //   { ind_id: 3, email: "jomel.gcm3@gmail.com"},
      //   { ind_id: 8, email: "jomelgithub@gmail.com"}
      // ]
      const all_emails = this.emailSiteManagerList;
      const all_emails_length = all_emails.length - 1;

      for (let i = 0; i < all_emails.length; i++) {
        const res2 = await api.get(
          `individuals/emaildetails/${all_emails[i].ind_id}`
        );

        const sendEmailData = {
          // send_from: "help@talentsage.com", //for testing
          // send_to: all_emails[i].email, //for testing
          send_from: res2.data.website_sender_email,
          send_to: res2.data.email,
          send_cc: "",
          send_bcc: "",
          subject: "Notification of User role change",
          body: emailBody,
          org_id: this.userData.org_id,
          suborg_id: 0,
          email_template_id: 0,
          ind_id: this.userData.ind_id,
        };

        try {
          const res = await api.post("sendemail", sendEmailData);

          if (res.data.type == "success") {
            if (i == all_emails_length) {
              this.isDisabledButton = false;

              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                res.data.message
              );
            }
          } else {
            this.isDisabledButton = false;
            return flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color
                ? this.brandData.flash_text_color
                : "#ffffff",
              res.data.message
            );
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    getAuthString() {
      var compareAuth = this.userDetails.roles;
      if (compareAuth.includes(1)) {
        const sourceStr = this.userAuthString.Participant;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(2)) {
        const sourceStr = this.userAuthString.Respondent;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(3)) {
        const sourceStr = this.userAuthString.SurveyPreviewer;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(4)) {
        const sourceStr = this.userAuthString.Coach;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(5)) {
        const sourceStr = this.userAuthString.FacultyViewer;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(6)) {
        const sourceStr = this.userAuthString.HRProfessionalViewer;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(7)) {
        const sourceStr = this.userAuthString.ClientAdministratorViewer;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(8)) {
        const sourceStr = this.userAuthString.ClientAdministratorEditor;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(9)) {
        const sourceStr = this.userAuthString.ClientEmailTemplateEditor;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(10)) {
        const sourceStr = this.userAuthString.CXM;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(11)) {
        const sourceStr = this.userAuthString.MasterAdministrator;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(12)) {
        const sourceStr = this.userAuthString.MasterAdministratorEmails;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(13)) {
        const sourceStr = this.userAuthString.SubOrgManager;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(14)) {
        const sourceStr = this.userAuthString.AnnouncementManager;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(16)) {
        const sourceStr = this.userAuthString.SiteManager;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(17)) {
        const sourceStr = this.userAuthString.SurveyCreator;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth.includes(18)) {
        const sourceStr = this.userAuthString.SurveyManager;
        const searchStr = "1";
        const indexes = [
          ...sourceStr.matchAll(new RegExp(searchStr, "gi")),
        ].map((a) => a.index);
        for (let i = 0; i < indexes.length; i++) {
          const str = this.userAuthStringResult;
          const replacement = "1";
          const replaced =
            str.substring(indexes[0], indexes[i]) +
            replacement +
            str.substring(indexes[i] + 1);
          this.userAuthStringResult = replaced;
        }
      }
      if (compareAuth == []) {
        this.userAuthStringResult =
          "000000000000000000000000000000000000000000000000000000000";
      }
      this.userDetails.auth_string = this.encrypt(
        this.userAuthStringResult,
        this.userDetails.seed
      );
    },
  },
  computed: {
    mapSubOrg: function () {
      return this.userSubOrg
        .sort((a, b) => a.suborg_name.localeCompare(b.suborg_name))
        .map(function (el) {
          if (this.userDetails.org_id == el.org_id) {
            return { value: el.suborg_id, label: el.suborg_name };
          }
        }, this);
    },

    filteredSubOrg: function () {
      return this.mapSubOrg.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    filteredProgram: function () {
      return this.userPrograms
        .sort((a, b) => a.program_name.localeCompare(b.program_name))
        .filter(function (el) {
          if (this.userDetails.org_id != "") {
            return (
              el.org_id == this.userDetails.org_id &&
              el.suborg_id == this.userDetails.suborgs
            );
          }
        }, this);
    },

    filteredIteration: function () {
      return this.userIterations
        .sort((a, b) => a.iteration_name.localeCompare(b.iteration_name))
        .filter(function (el) {
          if (this.userDetails.org_id != "") {
            return (
              el.org_id == this.userDetails.org_id &&
              el.suborg_id == this.userDetails.suborgs &&
              el.program_id == this.userDetails.indGroup.program_id
            );
          }
        }, this);
    },

    isChanged() {
      return (
        this.userDetails.email == this.passedDetails.email &&
        this.userDetails.first_name == this.passedDetails.first_name &&
        this.userDetails.last_name == this.passedDetails.last_name &&
        this.userDetails.suppress_email_sending ==
          this.passedDetails.suppress_email_sending &&
        this.userDetails.phone_number == this.passedDetails.phone_number &&
        this.userDetails.suborgs.join(", ") == this.passedDetails.suborgs &&
        this.userDetails.roles.join(", ") == this.passedDetails.roles &&
        this.userDetails.org_id == this.passedDetails.org_id
      );
    },
  },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style scoped>
.radio-btn {
  margin-top: 5px;
}
.radio-btn input {
  margin-left: 20px;
}
.box {
  align-self: center;
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0px 2px 10px -4px #000000;
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
.btn-disabled {
  background-color: #e2e2e2;
  color: #000000;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid rgba(27, 31, 35, 0.15);
  font-weight: 500;
  /* margin-left: 5px;
  padding-top: 5px;
  padding-bottom: 5px; */
  margin-top: 5px;
  padding: 8px 10px 8px 10px;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
