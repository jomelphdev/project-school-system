<script setup>
import Home from "./HomeComponent.vue";
import api from "../api/api.js";
import store from "../store/store.js"
import CryptoJS from 'crypto-js'
import ButtonSubmit from "./ButtonSubmit.vue";
import { flashMessage } from "../functions.js";
// import Bowser from "bowser";
</script>

<template>
 <div v-if="is2FAuthComplete">
    <div>
      <Home />
    </div>
  </div>
  <div v-else>
    <div class="twoFA-form">
      <img id ="twoFALogo" src="../../public/2FA.png">
      <h2><b>Authenticate Your Account</b></h2>
      <p style="text-align: center;">Protecting your account in <b>TalentSage</b> is our top priority. Please confirm your account by entering the authorization code sent to <b>{{ userEmail }}</b> <br><br>The code is valid for ten minutes from now. If you do request another code, you must use the newest code</p>
      <div class="InputContainer">
        <input
          class="input2FA"
          type="tel"
          name="pincode-1"
          maxlength="1"
          pattern="[\d]*"
          tabindex="1"
          placeholder="-"
          autocomplete="off"
          v-model="pincode[0]"
          @input="focusNextInput(1)"
          @keydown="focusPrevInput(0, $event)"
          @paste.prevent="handlePaste"
        >
        <input
          class="input2FA"
          type="tel"
          name="pincode-2"
          maxlength="1"
          pattern="[\d]*"
          tabindex="2"
          placeholder="-"
          autocomplete="off"
          v-model="pincode[1]"
          @input="focusNextInput(2)"
          @keydown="focusPrevInput(1, $event)"
          @paste.prevent="handlePaste"
        >
        <input
          class="input2FA"
          type="tel"
          name="pincode-3"
          maxlength="1"
          pattern="[\d]*"
          tabindex="3"
          placeholder="-"
          autocomplete="off"
          v-model="pincode[2]"
          @input="focusNextInput(3)"
          @keydown="focusPrevInput(2, $event)"
          @paste.prevent="handlePaste"
        >
        <input
          class="input2FA"
          type="tel"
          name="pincode-4"
          maxlength="1"
          pattern="[\d]*"
          tabindex="4"
          placeholder="-"
          autocomplete="off"
          v-model="pincode[3]"
          @input="focusNextInput(4)"
          @keydown="focusPrevInput(3, $event)"
          @paste.prevent="handlePaste"
        >
        <input
          class="input2FA"
          type="tel"
          name="pincode-5"
          maxlength="1"
          pattern="[\d]*"
          tabindex="5"
          placeholder="-"
          autocomplete="off"
          v-model="pincode[4]"
          @input="focusNextInput(5)"
          @keydown="focusPrevInput(4, $event)"
          @paste.prevent="handlePaste"
        >
        <input
          class="input2FA"
          type="tel"
          name="pincode-6"
          maxlength="1"
          pattern="[\d]*"
          tabindex="6"
          placeholder="-"
          autocomplete="off"
          v-model="pincode[5]"
          @input="focusNextInput(6)"
          @keydown="focusPrevInput(5, $event)"
          @paste.prevent="handlePaste"
        >
      </div>
      <div class="bottom-container">
      <p>
      It may take <b>up to a minute</b> to receive your code.
      </p>
        <div>
          <ButtonSubmit @click.prevent="handleSubmit()" label="Submit" style="font-size: 17px; padding: 13px;"/>
        </div>
      <p>
      Haven't received it?
        <a v-if="!showTimer" href="#" @click.prevent="resend2FAcode()" style="color:#F47820; font-weight: bold; text-decoration:none">
          Resend a new code.
        </a>
        <a v-if="showTimer" style="color:#F47820; font-weight: bold; text-decoration:none">
          You can resend again in {{ timer }} seconds.
        </a>
      </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  component: [Home, ButtonSubmit],
  name: "twoFA",
  props: {
    userMachineDetails: Object,
  },
  data: () => ({
    is2FAuthComplete: false,
    pincode: ['', '', '', '', '', ''],
    dataBase2FAcode: "",
    loginDetails: "",
    currentRole: [],
    isLoggedIn: false,
    showTimer: false,
    timer: 60,
    interval: null,
    userEmail: ""
  }),
  mounted() {
      // console.log('Machine Details :',this.userMachineDetails);
      this.loginDetails = this.userMachineDetails.loginDetails
      console.log('this.userMachineDetails',this.userMachineDetails)
      this.userEmail = this.loginDetails.email
      this.generate2FA()
      this.get2FA()
  },
  async updated() {
    try {
        const res = await api.get(`/get2FAcode/${this.userMachineDetails.ind_id}`)
        if(res.status === 200){
            this.dataBase2FAcode = res.data[0].two_factor_auth_code
            // console.log('2FA is updated to : ', this.dataBase2FAcode)
          }
      } catch (error) {
        console.log(error)
      }
  },
  computed: {
    combinedPinCode() {
      return this.pincode.join('');
    }
  },
  methods: {
    resend2FAcode(){
      // Start the timer
      this.showTimer = true;
      this.interval = setInterval(() => {
        // Decrement the timer by 1
        this.timer--;
        // If the timer reaches 0, stop the timer and show the "Resend a new code" link again
        if (this.timer === 0) {
          clearInterval(this.interval);
          this.showTimer = false;
          this.timer = 60;
        }
      }, 1000);
      // Call the API to resend the 2FA code
      // ...
      this.generate2FA()
      this.get2FA()
      console.log('Resend a new code success!')
    },
    async get2FA() {
      try {
        const res = await api.get(`/get2FAcode/${this.userMachineDetails.ind_id}`)
        this.dataBase2FAcode = res.data[0].two_factor_auth_code
        if(res.status === 200 && this.dataBase2FAcode !== 0 && this.dataBase2FAcode !== null){
            this.send2FacAuthEmail(`
            <p>Dear ${this.loginDetails.first_name ? this.loginDetails.first_name : 'Participant'},</p>
            <p>Security of your data is very important to us. An attempted login to your TalentSage account has been made a while longer than usual or on a different device since your last login. As a security measure, we'd like to authenticate your identity for your own protection.</p>
            <p>Please use your unique, one-time security code <span style="color:#F47820; font-weight:bold; font-size: 16px;word-spacing: 30px;">${this.dataBase2FAcode}</span> sent by email to validate your identity and securely access your TalentSage account.</p>
            <p>If you did not initiate this login attempt, please reset your password immediately and email us on <a href="mailto:Help@TalentSage.com">Help@TalentSage.com</a> with any questions or suspected unauthorized access to your account. </p>
            <p>In the meantime, thank you for choosing TalentSage for your leadership skills development needs. </p>
            <p>Sincerely,<br>The TalentSage Team</p>
            `)
            // console.log('database 2FAcode is ',this.dataBase2FAcode)
          }
      } catch (error) {
        console.log(error)
      }
    },
    async generate2FA() {
      try {
        const res = await api.put(`/generate2FAcode/${this.userMachineDetails.ind_id}`)
        if(res.status === 200){
            console.log('2FA Successfully generated')
          }
      } catch (error) {
        console.log(error)
      }
    },
    focusNextInput(index) {
      if (this.pincode[index - 1]) {
        this.$nextTick(() => {
          const nextInput = this.$el.querySelector(`input[name="pincode-${index + 1}"]`);
          if (nextInput) {
            nextInput.focus();
          }
        });
      }
    },
    focusPrevInput(index, event) {
      if (event.keyCode === 8 && !this.pincode[index]) {
        this.$nextTick(() => {
          const prevInput = this.$el.querySelector(`input[name="pincode-${index}"]`);
          if (prevInput) {
            prevInput.focus();
          }
        });
      }
    },
    handlePaste(event) {
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedData = clipboardData.getData('text/plain').trim();
      if (pastedData.length === this.pincode.length) {
        this.pincode = pastedData.split('');
      } else {
        // handle incorrect length of pasted data
        flashMessage(
                this.$flashMessage,
                "#F47820",
                "#ffffff",
                "Please input 6 digits only"
              );
      }
    },
    handleSubmit(){
      if(this.dataBase2FAcode == '0'){
                flashMessage(
                this.$flashMessage,
                "#F47820",
                "#ffffff",
                "Your code is expired! Please click 'Resend a new code'"
              );
            return
            }
      if(this.combinedPinCode.length < 6){
        flashMessage(
              this.$flashMessage,
              "#F47820",
              "#ffffff",
              "Wrong 2FA Code!"
            );
      return
      } else {
        if(this.dataBase2FAcode == this.combinedPinCode){
          flashMessage(
              this.$flashMessage,
              "#F47820",
              "#ffffff",
              "2-Factor Authentication Success!"
            );
           // save last login
           api.put("/auths/lastlogin", {
                email: this.loginDetails.email.toLowerCase().trim(),
              });
              // give screens to logged in role
              this.Roles = this.loginDetails.roles;
              api.get("roles").then((result) => {
                var rolesData = result.data;
                var newValue = this.Roles.split(", ");
                var newRoleName = newValue.map(
                  (r) => rolesData.find((f) => f.role_id == r).role_name
                );
                this.currentRole = newRoleName;
                this.$emit("passLoginUp", this.loginDetails);
                this.$emit("passBrandUp", this.loginDetails.brandData);
                this.isLoggedIn = true;
                this.saveUserLog()
                this.$router.push("/");
                this.$emit("authenticate", this.isLoggedIn);
                store.commit(
                  "addAuthString",
                  this.decrypt(
                    this.loginDetails.auth_string,
                    this.loginDetails.seed
                  )
                );

                this.$flashMessage.show({
                  html: `<div style="background-color: ${
                    this.loginDetails.brandData.accent_color1
                      ? this.loginDetails.brandData.accent_color1
                      : "#F47820"
                  }; width:100%;">
                      <p style="margin-bottom:0; margin-left:1rem; color: #fff;">Welcome ${
                        this.loginDetails.first_name
                      } !</p>
                      <p style="margin-top:0; margin-left:1rem; color: #fff;">Role(s): ${this.currentRole.join(
                        ", "
                      )}</p>
                    </div>`,
                  clickable: true,
                })
            })
        } else {  
          flashMessage(
              this.$flashMessage,
              "#F47820",
              "#ffffff",
              "Wrong 2FA Code!"
            );
          return
        }
      }
    },
    async send2FacAuthEmail(emailBody){
      const sendEmailDetails = {
        send_from: this.loginDetails.brandData.website_sender_email,
        send_to: this.loginDetails.email,
        send_cc: "",
        send_bcc: "",
        subject: "TalentSage 2 Factor Authenticator",
        body: emailBody,
        org_id: this.loginDetails.org_id,
        suborg_id: this.loginDetails.suborgs
          ? this.loginDetails.suborgs
          : 0,
        email_template_id: 0,
        ind_id: this.loginDetails.ind_id,
      };
      try {
          const res = await api.post("sendemail", sendEmailDetails);
          // console.log('send 2fa emailDEtails',sendEmailDetails)
          console.log('send 2fa email',res)
        } catch (e) {
          console.log(e);
        }
    },
    async saveUserLog() {
      try {
        const res = await api.post("insertUserLog", {
          email: this.userMachineDetails.email,
          ind_id: this.userMachineDetails.ind_id,
          machine_id: this.userMachineDetails.machine_id,
          ip_address: this.userMachineDetails.ip_address,
          is_logged_in: this.userMachineDetails.is_logged_in,
          platform: this.userMachineDetails.platform,
          operating_system: this.userMachineDetails.operating_system,
          browser: this.userMachineDetails.browser,
          logical_processors: this.userMachineDetails.logical_processors,
        });
        if (res) {
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    },
    decrypt(src, passphrase) {
      const bytes = CryptoJS.AES.decrypt(src, passphrase);
      return bytes.toString(CryptoJS.enc.Utf8);
    },
  }
};
</script>

<style scoped>
#twoFALogo {
  height: 130px;
  width: 100px;
}
.InputContainer{
  display: flex;
  flex-flow: row;
}
.input2FA{
  width: 50px;
  font-size: 30px;
  height: 50px;
  padding: 5px;
  text-align: center;
  border: none;
  border-bottom: 3px solid #F47820;
  margin-right: 5px;
}
.input2FA:focus::placeholder {
  color: transparent;
}
.input2FA:not(:placeholder-shown){
  border-bottom: 1px solid rgb(218, 217, 217);
}
.input2FA:focus {
  outline: none !important;
  border:3px solid #F47820;
  }
.twoFA-form {
  display: flex;
  flex-flow: column;
  align-items: center;
  background: white;
  border-radius: 20px;
  padding:30px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  max-width: 600px;
  box-shadow: 0px 2px 10px -4px #000000;
      /* If you want to implement it in very old browser-versions */
-webkit-user-select: none; /* Chrome/Safari */ 
-moz-user-select: none; /* Firefox */
-ms-user-select: none; /* IE10+ */

/* The rule below is not implemented in browsers yet */
-o-user-select: none;

/* The rule below is implemented in most browsers by now */
user-select: none;
}
.btn {
  width: 30%;
  font-size: 100%;
  line-height: 1.15;
  font-weight: 500;
  margin: 6px 0;
  cursor: pointer;
  letter-spacing: 0.03em;
  padding: 10px 26px;
  box-shadow: 0 0 2px rgb(0 0 0 / 12%), 0 2px 2px rgb(0 0 0 / 20%);
  transition: all 0.2s ease-in-out;
}
input[type="checkbox"] {
  transform: scale(2);
  background-color: initial;
  cursor: default;
  appearance: auto;
  box-sizing: border-box;
  margin: 3px 3px 3px 4px;
  padding: initial;
  border: initial;
}

.form-control {
  height: 56px;
  font-size: 1rem;
}

.form-group input {
  font-weight: 400;
  margin-bottom: 20px;
  font-size: 1rem;
  line-height: 1.4375em;
  letter-spacing: 0.00938em;
  color: rgba(0, 0, 0, 0.87);
  box-sizing: border-box;
  cursor: text;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  position: relative;
  border-radius: 4px;
  padding: 16.5px 14px;
  box-shadow: 2px 4px #ccc;
  border: 2px solid #0E5071;
}
.form-group {
  position: relative;
}

h2 {
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  margin-top: 20px;
  margin-bottom: 10px;
}

label {
  font-size: 14px;
  padding-left: 16px;
}
.btm-msg {
  text-align: center;
  margin-top: 50px;
    /* If you want to implement it in very old browser-versions */
-webkit-user-select: none; /* Chrome/Safari */ 
-moz-user-select: none; /* Firefox */
-ms-user-select: none; /* IE10+ */

/* The rule below is not implemented in browsers yet */
-o-user-select: none;

/* The rule below is implemented in most browsers by now */
user-select: none;
}
span {
  position: absolute;
  top: 37%;
  left: 93%;
  transform: translate(0, -50%);
  cursor: pointer;
  right: 15px;
  color: #F47820;
  font-size: 25px;
}
span:hover {
  color: #f47820bd;
}
span:active {
  color: #ff6a00;
}
.forgot-password{
  /* If you want to implement it in very old browser-versions */
-webkit-user-select: none; /* Chrome/Safari */ 
-moz-user-select: none; /* Firefox */
-ms-user-select: none; /* IE10+ */

/* The rule below is not implemented in browsers yet */
-o-user-select: none;

/* The rule below is implemented in most browsers by now */
user-select: none;
}
.button-div{
  display: flex;
  justify-content: center;
}
@media (max-width: 480px) {
.fa-eye {
margin-left: -15px;
cursor: pointer;
position: relative;
z-index: 2;          
}
}
.bottom-container{
  margin-top: 10px;
  display: flex;
  align-items: center;
  align-content: space-between;
  width: 100%;
  height: 100%;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
