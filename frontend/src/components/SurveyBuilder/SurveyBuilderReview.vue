<template>
  <div>
    <draggable
      :list="reviewList"
      :disabled="!enabled"
      item-key="name"
      class="list-group"
      ghost-class="ghost"
      handle=".handle"
    >
      <template #item="{ element }">
        <div class="list-group-item" :class="{ 'not-draggable': !enabled }">
          <div class="tabs">
            <div class="tab">
              <!-- <i class="fa fa-align-justify handle"></i>
              <input
                class="question-set-input"
                type="checkbox"
                :checked="element.isChecked"
                v-model="element.isChecked"
                @change="handleCheck(element.id)"
              /> -->
              <input
                class="accordion-input"
                type="checkbox"
                :id="'section' + element.id"
              />
              <label class="tab-label" :for="'section' + element.id">{{
                element.name
              }}</label>
              <div class="tab-content">
                <!--? Competencies -->
                <div v-if="element.id === 'Competencies'">
                  <div class="textOnInput">
                    <label for="selectLikert"
                      ><DescriptionInline label="Select Likert"
                    /></label>
                    <select
                      class="formControl"
                      id="selectLikert"
                      name="likert"
                      disabled
                    >
                      <option selected>{{ chosenLikert }}</option>
                    </select>
                  </div>
                  <draggable
                    :list="element.selectedCompetencies"
                    :disabled="enabled"
                    item-key="name"
                    class="list-group"
                    ghost-class="ghost"
                    handle=".handle"
                  >
                    <template #item="{ element }">
                      <div
                        class="list-group-item"
                        :class="{ 'not-draggable': !enabled }"
                      >
                        <div class="tabs">
                          <div class="tab">
                            <input
                              class="accordion-input"
                              type="checkbox"
                              :id="'compe' + element.competency_id"
                            />
                            <label
                              class="tab-label"
                              :for="'compe' + element.competency_id"
                              >{{ element.competency_name }}</label
                            >
                            <div class="tab-content">
                              <div class="section-intro">
                                <p class="intro-header">Section Introduction</p>
                                <p class="intro-content">
                                  {{ element.competency_desc }}
                                </p>
                              </div>
                              <div class="section-behavior">
                                <p class="behavior-header">Behavior</p>
                                <div class="behavior-content">
                                  <div
                                    v-for="data in element.behaviors"
                                    :key="data.behavior_id"
                                  >
                                    <label :for="data.behavior_id">{{
                                      data.behavior_desc
                                    }}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </draggable>
                </div>
                <!--? Competency Ranking -->
                <div v-else-if="element.id === 'CompetencyRanking'">
                  <div class="section-intro">
                    <p class="intro-header">Section Introduction</p>
                    <p class="intro-content">{{ element.introduction }}</p>
                  </div>
                  <div class="section-behavior">
                    <p class="behavior-header">Competencies</p>
                    <div class="behavior-content">
                      <div
                        v-for="data in element.questions"
                        :key="element.id + data.competency_id"
                      >

                        <label :for="element.id + data.competency_id"
                          >{{ data.competency_name }} -
                          {{ data.cii_desc }}</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <!--? Open-ended Questions -->
                <div v-else-if="element.id === 'OpenEndedQuestions'">
                  <div class="section-intro">
                    <p class="intro-header">Section Introduction</p>
                    <p class="intro-content">{{ element.introduction }}</p>
                  </div>
                  <div class="section-behavior">
                    <p class="behavior-header">Questions</p>
                    <div class="behavior-content">
                      <div v-for="data in element.questions" :key="data.oeq_id">
                        <label :for="element.id + data.oeq_id">{{
                          data.question
                        }}</label>
                      </div>
                    </div>
                  </div>
                </div>
                <!--? Organizational Climate -->
                <div v-else-if="element.id === 'OrganizationalClimate'">
                  <div class="section-intro">
                    <p class="intro-header">Section Introduction</p>
                    <p class="intro-content">{{ element.introduction }}</p>
                  </div>
                  <div class="section-behavior">
                    <p class="behavior-header">Questions</p>
                    <div class="behavior-content">
                      <div
                        v-for="data in element.questions"
                        :key="data.org_climate_id"
                      >
                        <label :for="element.id + data.org_climate_id">{{
                          data.question
                        }}</label>
                      </div>
                    </div>
                  </div>
                </div>
                <!--? Net Promoter Score -->
                <div v-else-if="element.id === 'NetPromoterScore'">
                  <div class="section-intro">
                    <p class="intro-header">Section Introduction</p>
                    <p class="intro-content">{{ element.introduction }}</p>
                  </div>
                  <div class="section-behavior">
                    <p class="behavior-header">Questions</p>
                    <div class="behavior-content">
                      <div
                        v-for="data in element.questions"
                        :key="data.nps_id"
                      >
                        <label :for="element.id + data.nps_id">{{
                          data.nps_question
                        }}</label>
                      </div>
                    </div>
                  </div>
                </div>
                <!--? Report Sharing Options -->
                <div v-else-if="element.id === 'ReportSharingOptions'">
                  <div class="section-intro">
                    <p class="intro-header">Section Introduction</p>
                    <p class="intro-content">{{ element.introduction }}</p>
                  </div>
                  <div class="section-behavior">
                    <p class="behavior-header">Questions</p>
                    <div class="behavior-content">
                      <div
                        v-for="data in element.questions"
                        :key="data.sharing_options_id"
                      >
                        <label :for="element.id + data.sharing_options_id">{{
                          data.question
                        }}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import DescriptionInline from "../DescriptionInline.vue";

export default {
  components: {
    draggable,
    DescriptionInline,
  },
  props: ["reviewList", "chosenLikert"],
  data() {
    return {
      enabled: true,
    };
  },
};
</script>
<style scoped>
.railroad-controls {
  display: flex;
  justify-content: space-between;
  margin: 10px 0 10px 0;
}
.handle {
  float: left;
  padding: 15px 10px 0 10px;
  color: rgb(244, 120, 32);
}
.question-set-input {
  float: left;
  margin: 17px 10px;
}
/* .subOrganizationBox {
  padding-bottom: 30px;
  margin-bottom: 40px;
  border-bottom: 2px solid black;
  font-size: 14px;
} */
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
.accordion-input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}
/* Accordion styles */
.tabs {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px -4px #000;
  margin: 10px 0px;
}
.tab {
  width: 100%;
  color: white;
  overflow: hidden;
}
.tab-label {
  display: flex;
  justify-content: space-between;
  padding: 1em;
  background: #f7f7f7;
  font-weight: bold;
  cursor: pointer;
  margin: 0px;
  color: rgb(0, 0, 0);
  /* Icon */
}
.tab-label:hover {
  background: #c5c5c5;
}
.tab-label::after {
  content: "\276F";
  width: 1em;
  height: 1em;
  text-align: center;
  transition: all 0.2s;
}
.tab-content {
  max-height: 0px;
  padding: 0 1em;
  color: #2c3e50;
  background: white;
  transition: all 0.2s;
}
.tab-close {
  display: flex;
  justify-content: flex-end;
  padding: 1em;
  font-size: 0.75em;
  background: #f5f5f5;
  cursor: pointer;
}
.tab-close:hover {
  background: #f7f7f7;
}
.accordion-input:checked + .tab-label {
  background: #c4c8cb;
}
.accordion-input:checked + .tab-label::after {
  transform: rotate(90deg);
}
.accordion-input:checked ~ .tab-content {
  max-height: 100vh;
  padding: 1em;
  overflow: auto;
}
p {
  margin: 0;
}
.intro-header,
.behavior-header {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}
.intro-content,
.behavior-content {
  font-size: 14px;
  padding: 10px;
}
#table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  border: 1px solid black;
}

#table td,
#table th {
  border: 1px solid #ddd;
  padding: 8px;
  /* word-break: word-wrap; */
}

#table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#table tr:hover {
  background-color: #ddd;
}

#table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  color: black;
  /* text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; */
  font-weight: 100;
}

#table td {
  text-align: left;
  vertical-align: middle;
  font-size: small;
}
#table td input {
  width: 100%;
  box-sizing: border-box; /* include padding and border in width */
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>