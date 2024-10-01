<script setup>
import ButtonSubmit from "./ButtonSubmit.vue";
import ButtonCancel from "./ButtonCancel.vue";
import api from "../api/api";
import { flashMessage } from "../functions.js";
import CryptoJS from 'crypto-js'

</script>

<template>
  <div>
    <div class="formBox">
      <div>
        <h4 class="profile-header">{{ text }}</h4>
        <hr/>
        <p>
          {{ secondText }} <strong>{{ userDetails.email }}</strong>
        </p>
      </div>

      <div class="show-hidden-buttons">
        <ButtonSubmit
          @click.prevent="toggle1 = !toggle1"
          label="Change My Password"
          v-show="!toggle1"
        />
      </div>

      <form class="hidden-form" v-show="toggle1" @submit.prevent="validate">
        <div>
          <label for="current-pass-inp" class="main-label"
            >Current password
            <input
              type="password"
              name="currentPass"
              v-model="currentPassword"
              class="passwordInput"
              placeholder="Confirm current password"
              required="required"
              id="current-pass-inp"
            />
            <label @click="showCurrentPassword">
              <i
                class="fa-solid fa-eye"
                id="togglePassword"
                style="
                  margin-left: -30px;
                  cursor: pointer;
                  position: relative;
                  z-index: 2;
                "
              ></i>
            </label>
          </label>
        </div>
        <div>
          <label for="new-pass-inp" class="main-label"
            >New password
            <input
              type="password"
              name="newPass"
              v-model="userDetails.password"
              class="passwordInput"
              placeholder="Enter new password"
              required="required"
              id="new-pass-inp"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
            />
            <label @click="showNewPassword">
              <i
                class="fa-solid fa-eye"
                id="togglePassword"
                style="
                  margin-left: -30px;
                  cursor: pointer;
                  position: relative;
                  z-index: 2;
                "
              ></i>
            </label>
          </label>
        </div>
        <p
          style="color: rgb(153, 153, 153); font-size: 85%; margin: 10px 0 0 0"
          class="notice"
        >
          New password must contain at least:
        </p>
        <p style="color: rgb(153, 153, 153); font-size: 85%; margin: 0 0 0 20px;">
              - 8 characters
          <br />
              - one number
          <br />
              - one uppercase letter
          <br />
              - one lowercase letter
        </p>
        <div class="hidden-btn">
          <ButtonSubmit
            label="Change My Password"
            class="btn-submit"
            type="submit"
          />
          <ButtonCancel
            @click.prevent="toggle1 = !toggle1"
            label="Cancel"
            class="btn-cancel"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyProfileChangePasswordBox",
  data: () => ({
    component: [ButtonSubmit, ButtonCancel],
    toggle1: false,
    checkPassword: "",
    currentPassword: "",
    userDetails: {
      email: "",
      password: "",
    },
  }),
  props: ["text", "secondText", "userData", "brandData"],
  async mounted() {
    await api.get("individuals/" + this.userData.ind_id).then((result) => {
      this.checkPassword = result.data.password;
      this.email = result.data.email;
      this.userDetails.email = result.data.email;
    });

  },
  methods: {
    decrypt(src, passphrase) {
      const bytes = CryptoJS.AES.decrypt(src, passphrase);
      return bytes.toString(CryptoJS.enc.Utf8);
    },

    encrypt(src, passphrase) {
      return CryptoJS.AES.encrypt(src, passphrase).toString();
    },

    showNewPassword() {
      var x = document.getElementById("new-pass-inp");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    },

    showCurrentPassword() {
      var y = document.getElementById("current-pass-inp");
      if (y.type === "password") {
        y.type = "text";
      } else {
        y.type = "password";
      }
    },

    validate() {
      if (this.currentPassword === this.decrypt(this.checkPassword, this.userData.seed)) {
        this.handleUpdatePassword();
      } else {
        flashMessage(
          this.$flashMessage,
          this.brandData.accent_color1
            ? this.brandData.accent_color1
            : "#F47820",
          this.brandData.flash_text_color
            ? this.brandData.flash_text_color
            : "#ffffff",
          "Current password do not match"
        );
      }
    },

    handleUpdatePassword() {
      api
        .put("individuals-password/" + this.userData.ind_id, {
          password: this.encrypt(this.userDetails.password, this.userData.seed)
        })
        .then(() => {
          this.currentPassword = "";
          this.userDetails.password = "";
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            "Successfully updated."
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
      this.toggle1 = !this.toggle1;
    },
  },
};
</script>

<style scoped>
.formBox{
  margin: 0;
  padding-top: 0;
}

.profile-header{
  display: flex;
  /* justify-content: center;
  align-content: center; */
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
.hidden-form input {
  font-weight: 400;
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
}
.main-label {
  width: 100%;
}
.notice {
  margin-top: 15px;
}
.hidden-form .hidden-btn {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.show-hidden-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-submit {
  width: 30%;
}
.fa-eye {
  color: #f47820;
}

@media only screen and (min-width: 280px) and (max-width: 900px) {
  .btn-submit {
    width: 65%;
    font-size: 3.5vw;
  }
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
