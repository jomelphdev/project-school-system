<script setup>
import DescriptionInline from "./DescriptionInline.vue";
import DropDownInfo from "./DropDownInfo.vue";
import FileUploader from "./FileUploader.vue";
</script>

<template>
  <form @submit="handleSubmit">
    <label style="color: #ccc" for="selectOrganisation"
      ><DescriptionInline label="Select organisation " />
    </label>

    <select
      class="input"
      name="category"
      id="category"
      v-model="selectedCategory"
    >
      <option value="" selected>Select Organisation</option>
      <option
        v-for="category in categories"
        v-bind:key="category.id"
        v-bind:value="category.id"
      >
        {{ category.name }}
      </option>
    </select>

    <label style="color: #ccc" for="selectSubOrganisation"
      ><DescriptionInline label="Select sub-organisation "
    /></label>
    <select class="input" name="item" id="item" v-model="selectedItem">
      <option value="" disabled>No selected</option>
      <option
        v-for="animal in filteredAnimals"
        v-bind:key="animal.id"
        v-bind:value="animal.id"
      >
        {{ animal.name }}
      </option>
    </select>

    <div class="box">
      <input type="checkbox" id="checkbox" v-model="trialTest" />
      <label for="checkbox"><DescriptionInline label="Trial/Test" /></label>
      <br />
      <input type="checkbox" id="checkbox" v-model="forSampleReport" />
      <label for="checkbox"
        ><DescriptionInline label="For sample report"
      /></label>
      <br />
      <p>
        Important: These cannot be changed! Please ensure these are both correct
        when creating new surveys, to avoid adversely affecting billing and
        participant reports.
      </p>
    </div>

    <br />

    <label for="selectSurveyTemplate"
      ><span style="color: #ccc">Select survey template</span></label
    ><br />
    <select
      class="input"
      id="selectSurveyTemplate"
      name="surveyTemplate"
      v-model="surveyTemplate"
    >
      <option :value="null" disabled>Select survey template</option>
      <option>Survey Template A</option>
      <option>Survey Template B</option>
    </select>

    <br />

    <label for="selectTimezone"
      ><span style="color: #ccc">Select time-zone</span></label
    ><br />
    <select
      class="input"
      id="selectTimezone"
      name="timezone"
      v-model="timezone"
    >
      <option :value="null" disabled>Select time-zone</option>
      <option>(GMT+00:00) Europe/London</option>
      <option>(GMT+01:00) Albania</option>
    </select>

    <br />
    <p>
      (any dates and times provided will be treated as though they are in this
      time-zone)
    </p>
    <FileUploader :onSubmit="onFileSubmit" />
    <br />

    <button class="btn">{{ buttonLabel }}</button>
  </form>
</template>

<script>
export default {
  name: "BulkAssignSurveysBox",
  component: [DescriptionInline, DropDownInfo, FileUploader],
  props: ["buttonLabel"],

  data: function () {
    return {
      initiation: "",
      file: null,
      timezone: "",
      surveyTemplate: "",
      forSampleReport: "",
      trialTest: "",

      categories: [
        { id: 0, name: "Reptile" },
        { id: 1, name: "Mammal" },
      ],

      animals: [
        { id: 0, category_id: 0, name: "Lizard" },
        { id: 1, category_id: 0, name: "Frog" },
        { id: 2, category_id: 0, name: "Alligator" },
        { id: 3, category_id: 1, name: "Dog" },
        { id: 4, category_id: 1, name: "Cat" },
        { id: 5, category_id: 1, name: "Monkey" },
      ],

      selectedCategory: "",

      selectedItem: "",
    };
  },

  mounted: function () {
    this.selectedCategory = 0;
    this.selectedItem = 0;
  },

  computed: {
    filteredAnimals: function () {
      return this.animals.filter(function (el) {
        return el.category_id === this.selectedCategory;
      }, this);
    },
  },

  methods: {
    onFileSubmit: function (file) {
      this.file = file;
      console.log(this.file);
    },
    handleSubmit() {
      console.log("submitted");
      console.log(this.email, this.firstName, this.suppressEmail);
    },
  },
};
</script>

<style scoped>
.input {
  width: 100%;
  outline: 0;
  border-width: 0 0 1px;
  border-color: grey;
  padding: 2px 5px;
  margin: 10px 0px;
  font-family: Arial, Helvetica, sans-serif;
}
.box {
  border: 1px solid #ccc;
  font: -webkit-control;
  margin: 0 10px;
  min-height: 400px;
  padding: 10px;
  min-width: 250px;
  min-height: 100px;
  box-shadow: 0px 2px grey;
}
.btn {
  background-color: #e67829;
  min-width: 70px;
  max-width: 200px;
  min-height: 30px;
  border: 1px solid #0000;
  color: #ffff;
  border-radius: 2px;
  box-shadow: 0px 2px grey;
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
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
