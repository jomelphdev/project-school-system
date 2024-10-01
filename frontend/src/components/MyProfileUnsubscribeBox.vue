<script setup>
import api from "../api/api";
import { flashMessage } from "../functions.js";
</script>

<template>
  <div class="formBox">
    <div>
      <h4 class="profile-header">{{ intro }}</h4>
      <hr/>
      <p class="paragraph-below">{{ secondIntro }}</p>
      <input
        type="checkbox"
        id="checkbox_1"
        v-model="userDetails.suppress_email_sending"
        true-value="1"
        false-value="0"
        @change="handleUpdateSuppressEmail"
      />
      <label for="checkbox_1" class="checkbox-description">{{ type }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyProfileUnsubscribeBox",
  props: {
    userData: Object,
    intro: String,
    type: String,
    secondIntro: String,
  },
  data: () => ({
    userDetails: {
      suppress_email_sending: "",
    },
  }),
  async mounted() {
    await api.get(`individuals/${this.userData.ind_id}`).then((result) => {
      this.userDetails.suppress_email_sending = result.data.suppress_email_sending;
    });
  },
  methods:{
    async handleUpdateSuppressEmail() {
      api
        .put("individuals-suppress_sending/" + this.userData.ind_id, this.userDetails)
        .then(() => {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
              this.userDetails.suppress_email_sending == 1 ? "Successfully unsubscribe from receiving non-transactional emails." : "Successfully subscribe to receive non-transactional emails."
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
    },
  }
};
</script>

<style scoped>
/* .paragraph-below {
  margin-top: 0;
} */

.formBox{
  padding-top: 0;
}


.profile-header{
  display: flex;
  /* justify-content: center;
  align-content: center; */
}

@media only screen and (min-width: 280px) and (max-width: 900px) {
  .checkbox-description {
    width: 65%;
    font-size: 3.5vw;
  }
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
