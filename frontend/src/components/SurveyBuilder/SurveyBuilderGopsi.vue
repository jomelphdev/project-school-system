<template>
  <div>
    <div class="textOnInput">
      <label for="selectOrganization"
        ><DescriptionInline label="Organization"
      /></label>
      <input class="formControl" type="text" :value="orgName" disabled />
    </div>

    <div class="textOnInput">
      <label for="selectSubOrganization"
        ><DescriptionInline label="Select sub-organization"
      /></label>
      <select class="formControl" id="selectSubOrganization" disabled>
        <option value="0">Select sub-organization</option>
        <option selected>{{ suborgName }}</option>
      </select>
    </div>

    <div class="textOnInput">
      <label for="selectProgram"
        ><DescriptionInline label="Select program"
      /></label>
      <select class="formControl" id="selectProgram" disabled>
        <option value="0">Select program</option>
        <option selected>{{ programName }}</option>
      </select>
    </div>

    <div class="textOnInput">
      <label for="selectIteration"
        ><DescriptionInline label="Select iteration"
      /></label>
      <select class="formControl" id="selectIteration" disabled>
        <option value="0">Select iteration</option>
        <option selected>{{ iterationName }}</option>
      </select>
    </div>

    <div class="textOnInput">
      <label for=""><DescriptionInline label="Survey for" /></label>
      <div>
        <input
          type="radio"
          :checked="surveyForParticipant"
          value="1"
          disabled
        />
        <label><DescriptionInline label="Participant" /></label>
        <input type="radio" :checked="surveyForNominee" value="0" disabled />
        <label><DescriptionInline label="Nominee" /></label>
      </div>
    </div>

    <div class="textOnInput">
      <label for="selectIteration"
        ><DescriptionInline label="Survey name"
      /></label>
      <input class="formControl" type="text" :value="surveyName" disabled />
    </div>

    <div class="textOnInput">
      <label for="selectIntro"
        ><DescriptionInline label="Survey introduction and instruction"
      /></label>
      <select class="formControl" id="selectIntro" name="subOrganization" disabled>
        <option>Select introduction and instruction</option>
        <option selected>{{ chosenInstruction }}</option>
      </select>
    </div>
  </div>
</template>
<script>
import DescriptionInline from "../DescriptionInline.vue";
export default {
  components: {
    DescriptionInline,
  },
  props: [
    "orgName",
    "suborgName",
    "programName",
    "iterationName",
    "surveyFor",
    "surveyName",
    "chosenInstruction",
  ],
  methods: {},
  computed: {
    surveyForParticipant() {
      if (this.surveyFor === "1") {
        return true;
      }
      return false;
    },
    surveyForNominee() {
      if (this.surveyFor === "0") {
        return true;
      }
      return false;
    },
  },
};
</script>
<style scoped>
.formControl {
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border-width: 0 0 1px;
  border-color: grey;
  padding: 2px 5px;
  /* margin-bottom: 1em; */
  outline: 0;
  width: -webkit-fill-available;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>