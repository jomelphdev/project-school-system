<script setup>
import ButtonSubmit from "./ButtonSubmit.vue";
import CryptoJS from "crypto-js";
import api from "../api/api.js";
import { replaceTokens } from "../functions.js";
import {flashMessage} from "../functions.js";
</script>
<template>
  <div class="forgot-password">
    <h2>Set my password</h2>
    <div class="description">
      <p>
        Enter the email associated with your account. If the email is registered
        in our system, we'll email you a link to create a new password.
      </p>
    </div>
    <div class="form-group">
      <input
        type="text"
        name="Email"
        v-model="Email"
        class="form-control"
        placeholder="Enter account email"
        required="required"
        id="emailInput"
      />
    </div>
    <div class = "buttonContainer">
        <ButtonSubmit @click="resetPassword()" label="Set My Password" />
    </div>
    <div><router-link to="/login">Return to Sign In page</router-link></div>
    <div class="btm-msg">
      <p>
        Unsure which email you used? <br />
        Look at any email received from us to <br />
        find your email associated with your account. <br />
        If you've not received an email, <br />contact, our helpdesk on
        Help@TalentSage.com.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  components: [ButtonSubmit],
  name: "ForgotPasswordScreen",
  data: () => ({
    isLoggedIn: false,
    Email: "",
    userData: [],
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
    catchProcessData: {
      ind_id: "",
      email: "",
      location: "",
      catch_1: "0",
      catch_2: "0", 
      catch_3: "0",
      catch_4: "0",
      catch_5: "0",
      catch_6: "0",
      catch_7: "0",
      catch_8: "0",
      org_id: "0",
      suborg_id: "0",
      created_by: "0",
      modified_by: "0",
    },
  }),
  mounted() {
    let decryptedEmail = this.decrypt(
      decodeURIComponent(this.$route.query.email),
      "seed"
    );
    this.Email = decryptedEmail;
  },
  methods: {
    getData() {
        const processedData = {
          "ind_id": this.catchProcessData.ind_id,
          "email": this.catchProcessData.email,
          "location": this.catchProcessData.location,
          "catch_1": this.catchProcessData.catch_1,
          "catch_2": this.catchProcessData.catch_2,
          "catch_3": this.catchProcessData.catch_3,
          "catch_4": this.catchProcessData.catch_4,
          "catch_5": this.catchProcessData.catch_5,
          "catch_6": this.catchProcessData.catch_6,
          "catch_7": this.catchProcessData.catch_7,
          "catch_8": this.catchProcessData.catch_8,
          "org_id": this.catchProcessData.org_id,
          "suborg_id": this.catchProcessData.suborg_id,
          "created_by": this.catchProcessData.created_by,
          "modified_by": this.catchProcessData.modified_by
        }
            return processedData
    },
    encrypt(src, passphrase) {
      return CryptoJS.AES.encrypt(src, passphrase).toString();
    },
    decrypt(src, passphrase) {
      const bytes = CryptoJS.AES.decrypt(src, passphrase);
      return bytes.toString(CryptoJS.enc.Utf8);
    },
    resetPassword() {
      //this.userData.suborgs ? this.userData.suborgs : 0
      if (this.Email == "" || this.Email == null || this.Email == undefined) {
        flashMessage(this.$flashMessage, '#F47820', '#ffffff', "Please Enter a valid Email Address!")
        return null;
      }
      api.get(`individuals/email/${this.Email.trim()}`).then((response) => {
        this.userData = response.data;
        if (this.userData.length <= 0) {
          flashMessage(this.$flashMessage, '#F47820', '#ffffff', "Please Enter a valid Email Address!")
          return null;
        }
        api
          .get(
            `email-templates/template-type/Password reset/org/${
              this.userData.org_id ? this.userData.org_id : 1
            }/suborg/0/program/0`
          )
          .then((response) => {
            // log password reset (get email template for pw reset)
            this.catchProcessData.location = 'Getting Email template for PW reset'
            this.catchProcessData.ind_id = this.userData.ind_id
            const data = this.getData()
              api
                .post("/logresetpasswordprocess", data)
                .then(() => {
                  console.log('password reset process logged!')
                  console.log('catchProcessData', data)
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
            let arr = [];
            arr = response.data;
            if (arr.length > 0 || arr != "") {
              this.emailTemplateId = response.data.email_template_id;
              this.subject = response.data.subject;
              this.email_body = response.data.email_body;
                 api
                    .get(`individuals/emaildetails/${this.userData.ind_id}`)
                    .then((response) => {
                      let res = response.data;
                      //emailTokens: {result: {key: value}}
                      this.tokens.recipient_email = res.email;
                      const data = {
                        result: {
                          recipient_email: res.email,
                          website_url: res.website_url,
                          nominee_salutation: res.nominee_salutation,
                          nominee_message: res.nominee_message,
                          program_name: res.program_name,
                          suborg_name: res.suborg_name,
                          website_sender_email: res.website_sender_email,
                          website_terms_url: res.website_terms_url,
                          website_privacy_url: res.website_privacy_url,
                          website_contact_email: res.website_contact_email,
                          survey_close_date: res.survey_close_date,
                          days_until_survey_close_date:
                            res.days_until_survey_close_date,
                          survey_template_name: res.survey_template_name,
                          survey_description: res.survey_description,
                          user_full_name: res.first_name + " " + res.last_name,
                          survey_subject_first_name:
                            res.survey_subject_first_name,
                          survey_subject_full_name:
                            res.survey_subject_full_name,
                          iteration_name: res.iteration_name,
                          brand_path: res.brand_path
                        },
                      };
                      this.tokens = { ...data.result };

                      let encryptedID = this.encrypt(
                        this.userData.ind_id.toString(),
                        "seed"
                      );
                      const password_link =
                        "<a href =" +
                        this.tokens.website_url +
                        "#/set_password?ind_id=" +
                        encodeURIComponent(encryptedID) +
                        "> Click Here </a>";

                      const convertedSubject = replaceTokens(
                        this.subject,
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
                        suborg_id: this.userData.suborgs
                          ? this.userData.suborgs
                          : 0,
                        email_template_id: this.emailTemplateId,
                        ind_id: this.userData.ind_id,
                      };
                        // log password reset (get tokens and details)
                        this.catchProcessData.location = 'Getting Email tokens, and details'
                        this.catchProcessData.ind_id = this.userData.ind_id
                        const data1 = this.getData()
                          api
                            .post("/logresetpasswordprocess", data1)
                            .then(() => {
                              console.log('password reset process logged!')
                              console.log('catchProcessData', data1)
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
                      // send email
                      api
                        .post("sendemail", data2)
                        .then((res) => {
                          // log password reset (sending email)
                          this.catchProcessData.location = 'Password reset Email Sucessful!'
                          this.catchProcessData.ind_id = this.userData.ind_id
                          const data3 = this.getData()
                            api
                              .post("/logresetpasswordprocess", data3)
                              .then(() => {
                                console.log('password reset process logged!')
                                console.log('catchProcessData', data3)
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
                          this.$flashMessage.show({
                            type: res.data.type,
                            title: res.data.message,
                            message: "",
                          });
                          this.Email = "";
                        })
                        .catch((e) => {
                          this.$flashMessage.show({
                            type: "error",
                            title: e.message,
                            message: "",
                          });
                        });
                    });
            } else {
              // log password reset (use default email template because user has none)
              this.catchProcessData.location = 'PW reset Email Sent using default template!'
                          this.catchProcessData.ind_id = this.userData.ind_id
                          const data4 = this.getData()
                            api
                              .post("/logresetpasswordprocess", data4)
                              .then(() => {
                                console.log('password reset process logged!')
                                console.log('catchProcessData', data4)
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
              api
                .get(
                  "email-templates/template-type/Password reset/org/0/suborg/0/program/0"
                )
                .then((res) => {
                  (this.emailTemplateId = res.data.email_template_id),
                    (this.subject = res.data.subject),
                    (this.email_body = res.data.email_body);
                  //send email starts here
                  // email tokens - get single data
                  api
                    .get(`individuals/emaildetails/${this.userData.ind_id}`)
                    .then((response) => {
                      let res = response.data;
                      //emailTokens: {result: {key: value}}
                      this.tokens.recipient_email = res.email;
                      const data = {
                        result: {
                          recipient_email: res.email,
                          website_url: res.website_url,
                          nominee_salutation: res.nominee_salutation,
                          nominee_message: res.nominee_message,
                          program_name: res.program_name,
                          suborg_name: res.suborg_name,
                          website_sender_email: res.website_sender_email,
                          website_terms_url: res.website_terms_url,
                          website_privacy_url: res.website_privacy_url,
                          website_contact_email: res.website_contact_email,
                          survey_close_date: res.survey_close_date,
                          days_until_survey_close_date:
                            res.days_until_survey_close_date,
                          survey_template_name: res.survey_template_name,
                          survey_description: res.survey_description,
                          user_full_name: res.first_name + " " + res.last_name,
                          survey_subject_first_name:
                            res.survey_subject_first_name,
                          survey_subject_full_name:
                            res.survey_subject_full_name,
                          iteration_name: res.iteration_name,
                          brand_path: res.brand_path
                        },
                      };
                      this.tokens = { ...data.result };

                      let encryptedID = this.encrypt(
                        this.userData.ind_id.toString(),
                        "seed"
                      );
                      const password_link =
                        "<a href =" +
                        this.tokens.website_url +
                        "#/set_password?ind_id=" +
                        encodeURIComponent(encryptedID) +
                        "> Click Here </a>";

                      const convertedSubject = replaceTokens(
                        this.subject,
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
                        suborg_id: this.userData.suborgs
                          ? this.userData.suborgs
                          : 0,
                        email_template_id: this.emailTemplateId,
                        ind_id: this.userData.ind_id,
                      };
                      // send email
                      api
                        .post("sendemail", data2)
                        .then((res) => {
                          this.$flashMessage.show({
                            type: res.data.type,
                            title: res.data.message,
                            message: "",
                          });
                          this.Email = "";
                        })
                        .catch((e) => {
                          this.$flashMessage.show({
                            type: "error",
                            title: e.message,
                            message: "",
                          });
                        });
                    });
                });
            }
          });
      });
    },
  },
};
</script>

<style scoped>
.forgot-password {
  background: white;
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
  padding: 20px;
  margin-top: 20px;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 2px 10px -4px #000000;
}
.btn {
  background-color: #e67829;
  width: 100%;
  color: #fff;
  fill: #fff;
  font-size: 100%;
  line-height: 1.15;
  font-weight: 500;
  margin: 6px 0;
  border: 0;
  outline: 0;
  border-radius: 2px;
  cursor: pointer;
  letter-spacing: 0.03em;
  padding: 10px 26px;
  box-shadow: 0 0 2px rgb(0 0 0 / 12%), 0 2px 2px rgb(0 0 0 / 20%);
  transition: all 0.2s ease-in-out;
  margin-top: 5px;
  margin-bottom: 10px;
}

h2 {
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  margin-top: 20px;
  text-align: left;
}

.description {
  text-align: left;
  margin-top: 20px;
}

.form-group input {
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.2em;
  letter-spacing: 0.00938em;
  color: rgba(0, 0, 0, 0.87);
  box-sizing: border-box;
  cursor: text;
  display: inline-flex;
  -webkit-box-align: center;
  width: 100%;
  position: relative;
  border-radius: 4px;
  padding: 16.5px 14px;
  margin-bottom: 10px;
}
.form-control {
  border: 2px solid #0e5071;
}
.btm-msg {
  text-align: center;
  margin-top: 50px;
}
.buttonContainer {
  display: flex;
  justify-content: space-around;
  margin-top: 8px;
  margin-bottom: 12px;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
