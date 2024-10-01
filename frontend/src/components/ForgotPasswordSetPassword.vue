<script setup>
import ButtonSubmit from "./ButtonSubmit.vue";
import CryptoJS from 'crypto-js'
import api from "../api/api";
import Swal from "sweetalert2";
import {flashMessage} from "../functions.js";
</script>
<template>
<div class="forgot-password">
  <h2>Set your new password</h2>
    <div class="description">
      <p>Enter your new preferred password here for secure access to your account.</p>
    </div>
    <form @submit.prevent="" method="post">
    <div class="form-group">
            <input
              type="password"
              name="Password"
              v-model="inputPassword.password"
              class="form-control"
              placeholder="Password *"
              required="required"
              id="passwordInput"
            />
            <span @click="showPassword()">
              <i class="fa fa-eye"
              aria-hidden="true"
              id="eye"
              ></i>
            </span>
    </div>
    <div class="set-password">
      <center><ButtonSubmit @click="setNewPassword()" label="Set new Password" /></center>
    </div>
    </form>
</div>
</template>

<script>
export default {
  components: [ButtonSubmit],
  name: "ForgotPasswordSetPassword",
  data: () => ({
    isLoggedIn: false,
    inputPassword: {
      password: "",
    },
    userInfos: [],
    catchProcessData: {
      ind_id: "",
      email: "",
      location: "",
      catch_1: "0",// Validation for password length
      catch_2: "0",   // Validation for The encoded url from email should not be empty string or null using vue.js code
      catch_3: "0", // Validation for The encoded url from email should not be empty string or null using javascript code
      catch_4: "0",    // Get individual details from the decryptedID from the email link
      catch_5: "0",  // Save password the password of the individual using his unique generated seed
      catch_6: "0",   // Display pop-up message that says 'Password set sucessful'
      catch_7: "0",  // Re-direct the individual into the login page when the button is clicked.
      catch_8: "0", // Catch error message
      org_id: "0",
      suborg_id: "0",
      created_by: "0",
      modified_by: "0",
    },
  }),
  methods: {
    mounted(){
      // this.isLoggedIn = true;
      // this.$emit("authenticate", this.isLoggedIn);
    },
    encrypt (src, passphrase) {
      return CryptoJS.AES.encrypt(src, passphrase).toString()
    },
    decrypt (src, passphrase) {
      const bytes = CryptoJS.AES.decrypt(src, passphrase)
      return bytes.toString(CryptoJS.enc.Utf8)
    },
    showPassword() {
      var x = document.getElementById("passwordInput");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    },
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
    setNewPassword() {
      let decrypedID = parseInt(this.decrypt(decodeURIComponent(this.$route.query.ind_id), "seed"))
      var encryptedPassword = {}
      // Validation for password length = catch1
      if(this.inputPassword.password.length < 8){
        flashMessage(this.$flashMessage, '#F47820', '#ffffff', "Please Input 8+ characters!")
        this.catchProcessData.location = 'Validation for password length'
        this.catchProcessData.ind_id = decrypedID
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
        return null
      }
      // Validation for The encoded url from email should not be empty string or null using vue.js code = catch2
      if(this.$route.query.ind_id == "" || this.$route.query.ind_id == null){
            this.$flashMessage.show({
            type: "error",
            title: "Invalid Action!",
            message: "",
          });
          this.catchProcessData.location = 'encoded url vue.js code'
          this.catchProcessData.ind_id = decrypedID
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
          return null
      }
      // Validation for The encoded url from email should not be empty string or null using javascript code = catch3
      else if(decrypedID == null|| isNaN(decrypedID))
      {
            this.$flashMessage.show({
            type: "error",
            title: "Invalid Action!",
            message: "",
          });
          this.catchProcessData.location = 'encoded url javascript code'
          this.catchProcessData.ind_id = decrypedID
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
          return null
      }
      api
        // Get individual details from the decryptedID from the email link = catch4
        .get("individuals/" + decrypedID)
        .then((result) => {
          this.userInfos = result.data;
          this.catchProcessData.ind_id = this.userInfos.ind_id
          this.catchProcessData.email = this.userInfos.email
          this.catchProcessData.org_id = this.userInfos.org_id
          this.catchProcessData.suborg_id = this.userInfos.suborgs
          this.catchProcessData.created_by = this.userInfos.ind_id
          this.catchProcessData.modified_by = this.userInfos.ind_id
        encryptedPassword['password'] = this.encrypt(this.inputPassword.password, this.userInfos.seed)
      api
        .put("individuals-password/" + decrypedID, encryptedPassword)
        .then(() => {
      // Save password the password of the individual using his unique generated seed = catch5
      // Display pop-up message that says 'Password set sucessful' = catch6
          this.catchProcessData.location = 'Password reset sucessful!'
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
          Swal.fire({
            title: "<span style='font-family:Open Sans;'> Password successfully set! </span>",
            text: "",
            icon: "success",
            confirmButtonText: "<span style='font-family:Open Sans;'> Proceed to Sign in page </span>",
            confirmButtonColor: "#B2C225",
            allowOutsideClick: false
          }).then((result) => {
      // Re-direct the individual into the login page when the button is clicked.
            if (result.isConfirmed) {
              this.$router.push({path: '/login'}) 
            }
          })
          this.inputPassword.password = "";
        })
      // Catch error message
        .catch((e) => {
          this.catchProcessData.location = 'Catch error message'
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
          this.$flashMessage.show({
            type: "error",
            title: e.message,
            message: "",
          });
        });
      });
    },    
  },
};
</script>

<style scoped>
.forgot-password {
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
  background: white;
  border-radius: 20px;
  padding:20px;
  margin-top: 20px;
  box-shadow: 0px 2px 10px -4px #000000;
}

h2{
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
.form-group {
  position: relative;
}
.set-password {
  margin-bottom: 10px;
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
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
