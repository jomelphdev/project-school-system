<script setup>
import ButtonSubmit from "./ButtonSubmit.vue";
import ButtonCancel from "./ButtonCancel.vue";
import api from "../api/api";
import { flashMessage } from "../functions.js";
</script>
<template>
  <div class="formBox">
    <div>
      <h4 class="profile-header">{{ text }}</h4>
      <hr/>
      <p>{{ secondText }}</p>
      <p>
        {{ thirdText }} <strong>{{ email }}</strong>
      </p>
    </div>

    <div class="show-hidden-buttons">
      <ButtonSubmit
        @click.prevent="toggle2 = !toggle2"
        label="Change My Email"
        v-show="!toggle2"
      />
    </div>

    <form
      class="hidden-form"
      v-show="toggle2"
      @submit.prevent="handleUpdateEmail"
    >
      <label for="emailInput" class="main-label"
        >New email
        <input
          type="text"
          name="password"
          v-model="userDetails.email"
          class="first-name-inp"
          placeholder="Enter preferred email"
          required="required"
          id="emailInput"
        />
      </label>

      <div class="hidden-btn">
        <ButtonSubmit
          label="Change My Email"
          class="btn-submit"
          type="submit"
        />
        <ButtonCancel
          @click.prevent="toggle2 = !toggle2"
          label="Cancel"
          class="btn-cancel"
        />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "MyProfileEmailBox",
  data: () => ({
    component: [ButtonSubmit, ButtonCancel],
    toggle2: false,
    email: "",
    userDetails: {
      email: "",
      password: "",
    },
  }),
  props: ["text", "secondText", "thirdText", "userData", "brandData"],
  async mounted() {
    await api.get("individuals/" + this.userData.ind_id).then((result) => {
      this.checkPassword = result.data.password;
      this.email = result.data.email;
      this.userDetails.email = result.data.email;
    });
  },
  methods: {
    handleUpdateEmail() {
      api
        .put("individuals-email/" + this.userData.ind_id, this.userDetails)
        .then((res) => {
          if(res.status >= 200 || res.status <= 299){
            api.put("survey-assignment/recipient-email/" + this.userData.ind_id, this.userDetails)
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
          }else{
            flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            "Something went wrong cannot save changes, Please refresh page."
          );
          }
          this.email = this.userDetails.email;
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
      this.toggle2 = !this.toggle2;
    },
  },
};
</script>

<style scoped>

.formBox{
  padding-top: 0;
}

.profile-header{
  display: flex;
  /* justify-content: center;
  align-content: center; */
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