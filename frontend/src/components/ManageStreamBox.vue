<script setup>
import DescriptionInline from './DescriptionInline.vue'
import Header from './Header.vue'
import ButtonSubmit from './ButtonSubmit.vue'
import ButtonCancel from './ButtonCancel.vue'
import api from '../api/api'
import {flashMessage} from "../functions.js";
</script>
<template>
  <section>
    <!-- Select Iteration -->
    <label for="selectMainIteration"
      ><DescriptionInline label="Select Iteration*"
    /></label>
    <select
      class="formControl"
      id="selectMainIteration"
      v-model="selectToManageIteration"
      @change="toManageIteration($event)"
    >
      <option disabled selected>Select iteration</option>
      <option
        v-for="iteration in sortIterationList"
        :key="iteration.interation_id"
        :value="iteration.iteration_name"
      >
        {{ iteration.iteration_name }}
      </option>
    </select>

    <!-- Manage Stream Section -->
    <div class="streamBox">
      <Header label="Manage stream" />
      <div class="formBox">
        <div>
          <label for="StreamName"
            ><DescriptionInline label="Stream name"
          /></label>
          <input
            id="StreamName"
            class="formControl"
            :disabled="!selectToManageIteration"
            v-model="addStreamInput"
          />
        </div>

        <div class="buttonBox">
          <ButtonSubmit
            label="Add"
            :disabled="!addStreamInput"
            @click="addStream()"
          />
          <ButtonCancel
            label="Cancel"
            :disabled="!addStreamInput"
            @click="clearAddField()"
          />
        </div>
      </div>

      <div class="formBox">
        <div>
          <label for="selectStream"
            ><DescriptionInline label="Select stream*"
          /></label>
          <select
            class="formControl"
            id="selectStream"
            v-model="chosenStream"
            @change="selectStream($event)"
          >
            <option disabled selected>Select stream</option>
            <option
              v-for="data in streamList"
              :key="data.stream_id"
              :value="data.stream_name"
            >
              {{ data.stream_name }}
            </option>
          </select>

          <label for="newStreamName"
            ><DescriptionInline label="Stream name*"
          /></label>
          <input
            id="newStreamName"
            class="formControl"
            v-model.lazy="chosenStream"
          />
        </div>

        <div class="buttonBox">
          <ButtonSubmit
            label="Update"
            :disabled="!chosenStream"
            @click="updateStream()"
          />
          <ButtonCancel
            label="Cancel"
            :disabled="!chosenStream"
            @click="clearUpdateFields()"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ManageStreamBox',
  component: [DescriptionInline, Header, ButtonSubmit, ButtonCancel],
  props: ['userData', 'brandData', 'suborgId', 'programId' , 'newIteration'],

  data: () => ({
    iterationList: [],
    streamList: [],
    selectToManageIteration: '',
    chosenIterationId: '',
    addStreamInput: '',
    chosenStream: '',
    chosenStreamId: '',
    chosenProgramId: '',
    addClick: null,
  }),

  watch: {
    suborgId: {
      handler: function (newValue) {
        api.get(`programs/suborg/${newValue}`).then(() => {
          this.addStreamInput = ''
          this.selectToManageIteration = ''
          this.chosenStream = ''
        })
      },
    },
    programId: {
      handler: function (newValue) {
        api.get(`iterations/programs/${newValue}`).then((res) => {
          this.iterationList = res.data
          this.addStreamInput = ''
          this.selectToManageIteration = ''
          this.chosenStream = ''
          this.chosenProgramId = newValue
        })
      },
    },
    newIteration: {
      handler: function () {
        api.get(`iterations/programs/${this.chosenProgramId}`).then((res) => {
          this.iterationList = res.data
        })
      }
    }
  },

  computed: {
    sortIterationList() {
      return this.iterationList.sort((a, b) => (a.iteration_name.toUpperCase() < b.iteration_name.toUpperCase()) ? -1 : ((b.iteration_name.toUpperCase() > a.iteration_name.toUpperCase()) ? 1 : 0))
    },
    sortStreamList() { 
      return this.streamList.sort((a, b) => (a.stream_name.toUpperCase() < b.stream_name.toUpperCase()) ? -1 : ((b.stream_name.toUpperCase() > a.stream_name.toUpperCase()) ? 1 : 0))
    },
  },

  methods: {
    async toManageIteration(e) {
      this.addStreamInput = ''
      this.chosenStream = ''
      let chosenIteration = e.target.value
      for (const data of this.iterationList) {
        if (data.iteration_name === chosenIteration) {
          this.chosenIterationId = data.iteration_id
        }
      }
      try {
        const res = await api.get(`streams/iteration/${this.chosenIterationId}`)
        if (res) {
          this.streamList = res.data
        }
      } catch (error) {
        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
      }
      this.$emit('passedIterationId', this.chosenIterationId)
    },

    async addStream() {
      let duplication = false
      for (const data of this.streamList) {
        if (
          data.stream_name.toUpperCase() === this.addStreamInput.toUpperCase()
        ) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', this.addStreamInput+ " already exist!")
          duplication = true
        }
      }
      if (!duplication) {
        try {
          const res = await api.post(`streams`, {
            stream_name: this.addStreamInput.trim(),
            org_id: this.userData.org_id,
            suborg_id: this.suborgId,
            program_id: this.programId,
            iteration_id: this.chosenIterationId,
            created_by: this.userData.ind_id,
            modified_by: this.userData.ind_id,
          })
          if (res) {
            flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Successfully added stream!")
          }
        } catch (error) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
        }
      }

      try {
        const res = await api.get(`streams/iteration/${this.chosenIterationId}`)
        if (res) {
          this.streamList = res.data
        }
      } catch (error) {
        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
      }
      this.addClick++
      this.$emit('addStream', this.addClick)
    },

    selectStream(e) {
      let chosenStream = e.target.value
      for (const data of this.streamList) {
        if (data.stream_name === chosenStream) {
          this.chosenStreamId = data.stream_id
        }
      }
    },

    async updateStream() {
      let duplication = false
      let noSpacesEnd = this.chosenStream.endsWith(' ')
      let noSpacesStart = this.chosenStream.startsWith(' ')
      for (const data of this.streamList) {
        if (
          data.stream_name.toUpperCase() === this.chosenStream.toUpperCase()
        ) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', this.chosenStream+ " already exist!")
          duplication = true
        }
      }
      if (!duplication) {
        if(noSpacesEnd === false && noSpacesStart === false) {
          try {
            const res = await api.put(`streams/${this.chosenStreamId}`, {
              stream_name: this.chosenStream.trim(),
              modified_by: this.userData.ind_id,
            })
            if (res) {
              flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Successfully updated stream!")
            }
          } catch (error) {
            flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
          }
        } else {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            "Please remove extra spaces in the beginning or end of the stream name"
          );
        }

        try {
          const res = await api.get(
            `streams/iteration/${this.chosenIterationId}`
          )
          if (res) {
            this.streamList = res.data
          }
        } catch (error) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
        }
      }
      this.addClick++
      this.$emit('updateStream', this.addClick)
    },

    clearAddField() {
      this.addStreamInput = ''
    },

    clearUpdateFields() {
      this.chosenStream = ''
    },
  },
}
</script>

<style scoped>
.streamBox {
  padding-bottom: 30px;
  margin-bottom: 40px;
  border-bottom: 2px solid black;
  font-size: 14px;
}
.formControl {
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
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
