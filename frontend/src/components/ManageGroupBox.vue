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
    <!-- Select Stream -->
    <label for="selectMainIteration"
      ><DescriptionInline label="Select stream*"
    /></label>
    <select
      class="formControl"
      id="selectMainIteration"
      v-model="selectToManageStream"
      @change="toManageStream($event)"
    >
      <option disabled selected>Select stream</option>
      <option
        v-for="data in sortStreamList"
        :key="data.stream_id"
        :value="data.stream_name"
      >
        {{ data.stream_name }}
      </option>
    </select>

    <!-- Manage Group Section -->
    <div class="groupBox">
      <Header label="Manage group" />
      <div class="formBox">
        <div>
          <label for="GroupName"
            ><DescriptionInline label="Group name"
          /></label>
          <input
            id="GroupName"
            class="formControl"
            :disabled="!selectToManageStream"
            v-model="addGroupInput"
          />
        </div>

        <div class="buttonBox">
          <ButtonSubmit
            label="Add"
            :disabled="!addGroupInput"
            @click="addGroup()"
          />
          <ButtonCancel
            label="Cancel"
            :disabled="!addGroupInput"
            @click="clearAddField()"
          />
        </div>
      </div>

      <div class="formBox">
        <div>
          <label for="selectGroup"
            ><DescriptionInline label="Select group*"
          /></label>
          <select
            class="formControl"
            id="selectGroup"
            v-model="chosenGroup"
            @change="selectGroup($event)"
          >
            <option disabled selected>Select group</option>
            <option
              v-for="data in sortGroupList"
              :key="data.group_id"
              :value="data.group_name"
            >
              {{ data.group_name }}
            </option>
          </select>

          <label for="newGroupName"
            ><DescriptionInline label="Group name*"
          /></label>
          <input
            id="newGroupName"
            class="formControl"
            v-model.lazy="chosenGroup"
          />
        </div>

        <div class="buttonBox">
          <ButtonSubmit
            label="Update"
            :disabled="!chosenGroup"
            @click="updateGroup()"
          />
          <ButtonCancel
            label="Cancel"
            :disabled="!chosenGroup"
            @click="clearUpdateFields()"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ManageGroupBox',
  component: [DescriptionInline, Header, ButtonSubmit, ButtonCancel],
  props: ['userData', 'brandData', 'suborgId', 'programId', 'iterationId', 'newStream'],

  data: () => ({
    streamList: [],
    groupList: [],
    selectToManageStream: '',
    chosenStreamId: '',
    addGroupInput: '',
    chosenGroup: '',
    chosenGroupId: '',
    chosenIterationId: '',
  }),
  watch: {
    suborgId: {
      handler: function (newValue) {
        api.get(`programs/suborg/${newValue}`).then(() => {
          this.addGroupInput = ''
          this.selectToManageStream = ''
          this.chosenGroup = ''
        })
      },
    },
    programId: {
      handler: function (newValue) {
        api.get(`iterations/programs/${newValue}`).then(() => {
          this.addGroupInput = ''
          this.selectToManageStream = ''
          this.chosenGroup = ''
        })
      },
    },
    iterationId: {
      handler: function (newValue) {
        api.get(`streams/iteration/${newValue}`).then((res) => {
          this.streamList = res.data
          this.addGroupInput = ''
          this.selectToManageStream = ''
          this.chosenGroup = ''
          this.chosenIterationId = newValue
        })
      },
    },
    newStream: {
      handler: function () {
        api.get(`streams/iteration/${this.chosenIterationId}`).then((res) => {
          this.streamList = res.data
        })
      }
    }
  },

  computed: {
    sortStreamList() { 
      return this.streamList.sort((a, b) => (a.stream_name.toUpperCase() < b.stream_name.toUpperCase()) ? -1 : ((b.stream_name.toUpperCase() > a.stream_name.toUpperCase()) ? 1 : 0))
    },
    sortGroupList() {
      return this.groupList.sort((a, b) => (a.group_name.toUpperCase() < b.group_name.toUpperCase()) ? -1 : ((b.group_name.toUpperCase() > a.group_name.toUpperCase()) ? 1 : 0))
    },
  },

  methods: {
    async toManageStream(e) {
      this.addGroupInput = ''
      this.chosenGroup = ''
      let chosenStream = e.target.value
      for (const data of this.streamList) {
        if (data.stream_name === chosenStream) {
          this.chosenStreamId = data.stream_id
        }
      }
      try {
        const res = await api.get(`groups/stream/${this.chosenStreamId}`)
        if (res) {
          this.groupList = res.data
        }
      } catch (error) {
        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
      }
    },

    async addGroup() {
      let duplication = false
      for (const data of this.groupList) {
        if (
          data.group_name.toUpperCase() === this.addGroupInput.toUpperCase()
        ) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', this.addGroupInput+ " already exist!")
          duplication = true
        }
      }
      if (!duplication) {
        try {
          const res = await api.post('groups', {
            group_name: this.addGroupInput.trim(),
            org_id: this.userData.org_id,
            suborg_id: this.suborgId,
            program_id: this.programId,
            iteration_id: this.iterationId,
            stream_id: this.chosenStreamId,
            created_by: this.userData.ind_id,
            modified_by: this.userData.ind_id,
          })
          if (res) {
            flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Successfully added group!")
          }
        } catch (error) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
        }
      }

      try {
        const res = await api.get(`groups/stream/${this.chosenStreamId}`)
        if (res) {
          this.groupList = res.data
        }
      } catch (error) {
        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
      }
    },

    selectGroup(e) {
      let chosenGroup = e.target.value
      for (const data of this.groupList) {
        if (data.group_name === chosenGroup) {
          this.chosenGroupId = data.group_id
        }
      }
    },

    async updateGroup() {
      let duplication = false
      let noSpacesEnd = this.chosenGroup.endsWith(' ')
      let noSpacesStart = this.chosenGroup.startsWith(' ')
      for (const data of this.groupList) {
        if (data.group_name.toUpperCase() === this.chosenGroup.toUpperCase()) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', this.chosenGroup+ " already exist!")
          duplication = true
        }
      }
      if (!duplication) {
        if(noSpacesEnd === false && noSpacesStart === false) {
          try {
            const res = await api.put(`groups/${this.chosenGroupId}`, {
              group_name: this.chosenGroup.trim(),
              modified_by: this.userData.ind_id,
            })
            if (res) {
              flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Successfully updated group!")
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
            "Please remove extra spaces in the beginning or end of the group name"
          );
        }

        try {
          const res = await api.get(`groups/stream/${this.chosenStreamId}`)
          if (res) {
            this.groupList = res.data
          }
        } catch (error) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
        }
      }
    },

    clearAddField() {
      this.addGroupInput = ''
    },

    clearUpdateFields() {
      this.chosenGroup = ''
    },
  },
}
</script>

<style scoped>
.groupBox {
  padding-bottom: 30px;
    border-bottom: none;
  margin-bottom: 0;
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
