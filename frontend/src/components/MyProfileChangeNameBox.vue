<script setup>
import ButtonSubmit from "./ButtonSubmit.vue";
import api from "../api/api";
import ButtonCancel from "./ButtonCancel.vue";
import { flashMessage } from "../functions.js";
</script>

<template>
  <div class="formBox">
    <div>
      <h4 class="profile-header">{{ text }}</h4>
      <hr />
      <p>{{ intro }}</p>
      <p>
        {{ type }}:
        <strong>{{ first_name + " " + last_name }}</strong>
      </p>
    </div>
    <div class="show-hidden-buttons">
      <ButtonSubmit
        @click.prevent="toggle = !toggle"
        label="Change My Name"
        v-show="!toggle"
      />
    </div>

    <form class="hidden-form" v-show="toggle" @submit.prevent="handleUpdate">
      <label for="firstNameInput"
        >First Name
        <input
          id="firstNameInput"
          type="text"
          name="firstName"
          class="first-name-inp"
          required="required"
          v-model="userDetails.first_name"
          placeholder="Enter preferred first name"
        />
      </label>

      <label for="lastNameInput"
        >Last Name
        <input
          id="lastNameInput"
          type="text"
          name="lastName"
          class="last-name-inp"
          required="required"
          v-model="userDetails.last_name"
          placeholder="Enter preferred family name"
        />
      </label>

      <div class="hidden-btn">
        <ButtonSubmit label="Change My Name" class="btn-submit" type="submit" />
        <ButtonCancel
          @click.prevent="toggle = !toggle"
          label="Cancel"
          class="btn-cancel"
        />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "MyProfileBoxChangeNameBox",
  data: () => ({
    component: [ButtonSubmit, ButtonCancel],
    toggle: false,
    first_name: "",
    last_name: "",
    userDetails: {
      first_name: "",
      last_name: "",
    },
  }),
  props: ["text", "intro", "type", "userData", "brandData"],

  async mounted() {
    await api.get("individuals/" + this.userData.ind_id).then((result) => {
      this.first_name = result.data.first_name;
      this.last_name = result.data.last_name;
      this.userDetails.first_name = result.data.first_name;
      this.userDetails.last_name = result.data.last_name;
    });
  },
  methods: {
    async handleUpdate() {
      api
        .put("individuals-name/" + this.userData.ind_id, this.userDetails)
        .then(() => {
          this.first_name = this.userDetails.first_name;
          this.last_name = this.userDetails.last_name;
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            "Successfully updated"
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
      this.toggle = !this.toggle;
    },
  },
};
</script>

<style scoped>
.profile-header {
  display: flex;
  /* justify-content: center;
  align-content: center; */
}

.formBox {
  padding-top: 0;
}
.hidden-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
