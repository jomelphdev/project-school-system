<script setup>
import Description from "./Description.vue";
import MyProfileChangeNameBox from "./MyProfileChangeNameBox.vue";
import MyProfileChangePasswordBox from "./MyProfileChangePasswordBox.vue";
import MyProfileUnsubscribeBox from "./MyProfileUnsubscribeBox.vue";
import MyProfileEmailBox from "./MyProfileEmailBox.vue";
import MyProfileTimezoneBox from "./MyProfileTimezoneBox.vue";
</script>

<template>
  <div class="body-container">
    <h1>My Profile</h1>
    <div style="display: flex; flex-direction: column">
      <div>
        <Description
          label="Manage your account preferences from this page."
        ></Description>
      </div>
      <MyProfileChangePasswordBox
        text="Manage your account password"
        secondText="Current email associated with this password:"
        :userData="userData"
        :brandData="brandData"
      />
      <MyProfileUnsubscribeBox
        intro="Control your email preferences"
        secondIntro="'Unsubscribe' if you only want to receive emails that are the direct result of your actions(transactional). Please note! if you unsubscribe from non-transactional emails, you won't receive reminders to complete actions before they close."
        type="Unsubscribe me from non-transactional emails"
        isChecked="false"
        :userData="userData"
        :brandData="brandData"
      />
      <MyProfileEmailBox
        text="Manage the email associated with your account"
        secondText="All email communications, including multifactor authentication codes, will be sent to this email."
        thirdText="Current email associated with this account:"
        :userData="userData"
        :brandData="brandData"
      />
      <MyProfileChangeNameBox
        text="Manage your name"
        intro="Adjust your name or the spelling to your preferred for use in this site, emails and reports."
        type="Current name"
        :userData="userData"
        :brandData="brandData"
      />
      <MyProfileTimezoneBox
        intro="Manage your account time zone"
        secondIntro="Select your typical work time zone to align your account communications."
        :userData="userData"
        :brandData="brandData"
      />
    </div>
  </div>
</template>

<script>
export default {
  component: [
    MyProfileChangeNameBox,
    Description,
    MyProfileChangePasswordBox,
    MyProfileUnsubscribeBox,
    MyProfileEmailBox,
    MyProfileTimezoneBox,
  ],
  props: {
    userData: Object,
    brandData: Object,
  },
  name: "MyProfile",
  data: () => ({}),
  async mounted() {},
};
</script>

<style scoped>
.body-container {
  width: 80%;
}

@media only screen and (min-width: 280px) and (max-width: 900px) {
  .body-container {
    width: 80%;
    background: white;
    margin: 0;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    box-shadow: 0px 2px 10px -4px #000000;
    border-radius: 20px;
    align-self: center;
    font-size: 3.5vw;
  }
}
</style>
