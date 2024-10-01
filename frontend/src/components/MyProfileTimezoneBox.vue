<script setup>
import ButtonSubmit from "./ButtonSubmit.vue";
import ButtonCancel from "./ButtonCancel.vue";
import DescriptionInline from "./DescriptionInline.vue";
import api from "../api/api";
import { flashMessage } from "../functions.js";
</script>
<template>
  <div class="formBox">
    <div>
      <h4 class="profile-header">{{ intro }}</h4>
      <hr />
      <p class="paragraph-below">{{ secondIntro }}</p>
    </div>

    <div class="show-hidden-buttons">
      <ButtonSubmit
        @click.prevent="toggle = !toggle"
        label="Change My Time zone"
        v-show="!toggle"
      />
    </div>

    <form
      class="hidden-form"
      v-show="toggle"
      @submit.prevent="handleUpdateTimezone"
    >
      <label for="selectTimezone" class="main-label"
        ><DescriptionInline label="Select Timezone*"
      /></label>
      <select
        class="formControl"
        id="selectTimezone"
        v-model="chosenTimezone"
        @change="selectTimezone($event)"
      >
        <option selected :value="null">Select Timezone</option>
        <option v-for="data in sortTimezoneList" :key="data">
          ({{ data.timezone_offset }}) {{ data.timezone_name }}
        </option>
      </select>

      <div class="hidden-btn">
        <ButtonSubmit
          label="Change My Time Zone"
          class="btn-submit"
          type="submit"
        />
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
  name: "MyProfileTimezoneBox",
  data: () => ({
    component: [ButtonSubmit, ButtonCancel, DescriptionInline],
    toggle: false,
    chosenTimezone: null,
    timezoneList: [],
  }),
  props: ["intro", "secondIntro", "userData", "brandData"],

  async mounted() {
    try {
      const res = await api.get(`get-time-zone`);
      if (res) {
        this.timezoneList = res.data;
      }
    } catch (e) {
      flashMessage(
        this.$flashMessage,
        this.brandData.accent_color1 ? this.brandData.accent_color1 : "#F47820",
        this.brandData.flash_text_color
          ? this.brandData.flash_text_color
          : "#ffffff",
        e.message
      );
    }

    try {
      const res = await api.get(`individuals/${this.userData.ind_id}`);
      if (res) {
        this.chosenTimezone = res.data.time_zone;
      }
    } catch (e) {
      flashMessage(
        this.$flashMessage,
        this.brandData.accent_color1 ? this.brandData.accent_color1 : "#F47820",
        this.brandData.flash_text_color
          ? this.brandData.flash_text_color
          : "#ffffff",
        e.message
      );
    }
  },
  computed: {
    sortTimezoneList() {
      return this.timezoneList.sort();
    },
  },
  methods: {
    selectTimezone(e) {
      this.chosenTimezone = e.target.value;
      console.log(this.chosenTimezone);
    },
    async handleUpdateTimezone() {
      try {
        const res = await api.put(
          `individuals/timezone/${this.userData.ind_id}`,
          {
            time_zone: this.chosenTimezone,
            modified_by: this.userData.ind_id,
          }
        );
        if (res) {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            "Successfully updated timezone!"
          );
        }
      } catch (e) {
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
      }
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
.hidden-form select {
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
/* .paragraph-below {
  margin-top: 0;
} */

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