<script setup>
import DescriptionInline from './DescriptionInline.vue'
import ManageSubOrgBox from './ManageSubOrgBox.vue'
import ManageProgramBox from './ManageProgramBox.vue'
import ManageIterationBox from './ManageIterationBox.vue'
import ManageStreamBox from './ManageStreamBox.vue'
import ManageGroupBox from './ManageGroupBox.vue'
import api from '../api/api'
</script>

<template>
  <div class="mainDiv">
    <section class="body-container">
      <label for="selectOrganisation" class="mt-1"
        ><DescriptionInline label="Organisation"
      /></label>
      <input
        type="text"
        class="formControl"
        name="organization"
        :value="orgList.org_name"
        disabled
      />
      <div class="mainTree">
        <ManageSubOrgBox 
          :userData="userData" 
          :brandData="brandData" 
          @addedSuborg="newSuborgAdded"
          @updateSuborg="updateSuborg"/>
        <div class="subTree">
          <ManageProgramBox
            :userData="userData"
            :brandData="brandData"
            :newSuborg ="newSuborg"
            @passedSuborgId="saveSuborgId"
            @addProgram="newProgramAdded"
            @updateProgram="updateProgram"
          />
          <div class="subTree">
            <ManageIterationBox
              :userData="userData"
              :brandData="brandData"
              :suborgId="suborgId"
              :newProgram="newProgram"
              @passedProgramId="saveProgramId"
              @addIteration="newIterationAdded"
              @updateIteration="updateIteration"
            />
            <div class="subTree">
              <ManageStreamBox
                :userData="userData"
                :brandData="brandData"
                :suborgId="suborgId"
                :programId="programId"
                :newIteration="newIteration"
                @passedIterationId="saveIterationId"
                @addStream="newStreamAdded"
                @updateStream="updateStream"
              />
              <div class="subTree">
                <ManageGroupBox
                  :userData="userData"
                  :brandData="brandData"
                  :suborgId="suborgId"
                  :programId="programId"
                  :iterationId="iterationId"
                  :newStream="newStream"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  component: [
    DescriptionInline,
    ManageSubOrgBox,
    ManageProgramBox,
    ManageIterationBox,
    ManageStreamBox,
    ManageGroupBox,
  ],
  props: {
    userData: Object,
    brandData: Object,
  },
  name: 'AdminDashboard',
  data: () => ({
    orgList: [],
    suborgId: '',
    programId: '',
    iterationId: '',
    newSuborg: null,
    newProgram: null,
    newIteration: null,
    newStream: null,
  }),
  mounted() {
    api
      .get(`organizations/${this.userData.org_id}`)
      .then((response) => {
        this.orgList = response.data
      })
      .catch((e) => {
        this.$flashMessage.show({
          type: 'error',
          title: e.message,
          message: '',
        })
      })
  },
  methods: {
    saveSuborgId(suborgId) {
      this.suborgId = suborgId
    },
    saveProgramId(programId) {
      this.programId = programId
    },
    saveIterationId(iterationId) {
      this.iterationId = iterationId
    },
    newSuborgAdded(data) { 
      this.newSuborg = data
    },
    newProgramAdded(data) { 
      this.newProgram = data
    },
    newIterationAdded(data) { 
      this.newIteration = data
    },
    newStreamAdded(data) { 
      this.newStream = data
    },
    updateSuborg(data) { 
      this.newSuborg = data
    },
    updateProgram(data) { 
      this.newProgram = data
    },
    updateIteration(data) { 
      this.newIteration = data
    },
    updateStream(data) { 
      this.newStream = data
    },
  },
}
</script>

<style scoped>
.mainDiv {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.manageOrgSection {
  margin: 20px 0;
  padding: 20px;
  background-color: #ffff;
  border-radius: 20px;
  box-shadow: 0px 2px 10px -4px #000000;
  max-width: 60vw;
}
.mainTree,
.subTree {
  border: 1px solid rgb(209, 209, 209);
  padding: 20px;
  border-radius: 7px;
}
.formControl {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border-width: 0 0 1px;
  border-color: grey;
  padding: 2px 5px;
  margin-bottom: 1em;
  outline: 0;
  width: -webkit-fill-available;
}

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
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
