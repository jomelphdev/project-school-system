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
    <!--Select Sub-organization -->
    <label for="toMangeSubOrganization"
      ><DescriptionInline label="Select sub-organization*"
    /></label>
    <select
      class="formControl"
      id="toMangeSubOrganization"
      name="toMangeSubOrganization"
      v-model="selectToManageSuborg"
      @change="toManageSuborg($event)"
    >
      <option disabled selected>Select sub-organization</option>
      <option
        v-for="subOrganization in sortSubOrganization"
        :value="subOrganization.suborg_name"
        :key="subOrganization.suborg_id"
      >
        {{ subOrganization.suborg_name }}
      </option>
    </select>

    <!-- Manage Program Section -->
    <div class="programBox">
      <Header label="Manage program" />
      <div class="formBox">
        <div>
          <label for="programName"
            ><DescriptionInline label="Program name"
          /></label>
          <input
            id="programName"
            class="formControl"
            :disabled="!selectToManageSuborg"
            v-model="addProgramInput"
          />
        </div>

        <div class="buttonBox">
          <ButtonSubmit
            label="Add"
            :disabled="!addProgramInput"
            @click.prevent="addProgram()"
          />
          <ButtonCancel
            label="Cancel"
            :disabled="!addProgramInput"
            @click="clearAddField()"
          />
        </div>
      </div>

      <div class="formBox">
        <div>
          <label for="selectProgram"
            ><DescriptionInline label="Select program*"
          /></label>
          <select
            class="formControl"
            id="selectProgram"
            :disabled="!selectToManageSuborg"
            v-model="chosenProgram"
            @change="selectProgram($event)"
          >
            <option disabled selected>Select program</option>
            <option
              v-for="program in sortProgram"
              :value="program.program_name"
              :key="program.program_id"
            >
              {{ program.program_name }}
            </option>
          </select>

          <label for="newProgramName"
            ><DescriptionInline label="Program name*"
          /></label>
          <input
            id="newProgramName"
            class="formControl"
            v-model.lazy="chosenProgram"
            :disabled="!chosenProgram"
          />
        </div>

        <div class="buttonBox">
          <ButtonSubmit
            label="Update"
            :disabled="!chosenProgram"
            @click.prevent="updateProgram()"
          />
          <ButtonCancel
            label="Cancel"
            :disabled="!chosenProgram"
            @click="clearUpdatedField()"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ManageProgramBox',
  component: [DescriptionInline, ButtonSubmit, ButtonCancel, Header],
  props: ['userData','brandData','newSuborg'],

  data: () => ({
    subOrgList: [],
    programList: [],
    selectToManageSuborg: '',
    chosenSubOrgId: '',
    addProgramInput: '',
    chosenProgramId: '',
    chosenProgram: '',
    addClick: null,
  }),

  async mounted() {
    try {
      const res = await api.get(`sub-organizations/${this.userData.org_id}`)
      if (res) {
        this.subOrgList = res.data
      }
    } catch (error) {
      flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
    }
  },
  watch: {
    newSuborg: {
      handler: async function () {
        try {
          const res = await api.get(`sub-organizations/${this.userData.org_id}`)
          if (res) {
            this.subOrgList = res.data
          }
        } catch (error) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
        }
      },
    },
  },
  computed: {
    sortSubOrganization() {
      return this.subOrgList.sort((a, b) => (a.suborg_name.toUpperCase() < b.suborg_name.toUpperCase()) ? -1 : ((b.suborg_name.toUpperCase() > a.suborg_name.toUpperCase()) ? 1 : 0))
    },
    sortProgram() { 
      return this.programList.sort((a, b) => (a.program_name.toUpperCase() < b.program_name.toUpperCase()) ? -1 : ((b.program_name.toUpperCase() > a.program_name.toUpperCase()) ? 1 : 0))
    },
  },
  methods: {
    async toManageSuborg(e) {
      this.addProgramInput = ''
      this.chosenProgram = ''
      let chosenSubOrg = e.target.value
      for (const data of this.subOrgList) {
        if (data.suborg_name === chosenSubOrg) {
          this.chosenSubOrgId = data.suborg_id
        }
      }
      try {
        const res = await api.get(`programs/suborg/${this.chosenSubOrgId}`)
        if (res) {
          this.programList = res.data
        }
      } catch (error) {
        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
      }
      this.$emit('passedSuborgId', this.chosenSubOrgId)
    },

    async selectProgram(e) {
      let chosenProgram = e.target.value
      for (const data of this.programList) {
        if (data.program_name === chosenProgram) {
          this.chosenProgramId = data.program_id
        }
      }

      try {
        const res = await api.get(`programs/suborg/${this.chosenSubOrgId}`)
        if (res) {
          this.iterationList = res.data
        }
      } catch (error) {
        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
      }
    },

    async addProgram() {
      let duplication = false
      for (const data of this.programList) {
        if (
          data.program_name.toUpperCase() === this.addProgramInput.toUpperCase()
        ) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', this.addProgramInput+ " already exist!")
          duplication = true
        }
      }
      if (!duplication) {
        try {
          const res = await api.post('programs', {
            program_name: this.addProgramInput.trim(),
            org_id: this.userData.org_id,
            suborg_id: this.chosenSubOrgId,
            created_by: this.userData.ind_id,
            modified_by: this.userData.ind_id,
          })
          if (res) {
            flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Successfully added program!")
          }
        } catch (error) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
        }
      }

      try {
        const res = await api.get(`programs/suborg/${this.chosenSubOrgId}`)
        if (res) {
          this.programList = res.data
        }
      } catch (error) {
        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
      }
      this.addClick++
      this.$emit('addProgram', this.addClick)
    },

    async updateProgram() {
      let duplication = false
      let noSpacesEnd = this.chosenProgram.endsWith(' ')
      let noSpacesStart = this.chosenProgram.startsWith(' ')
      for (const data of this.programList) {
        if (
          data.program_name.toUpperCase() === this.chosenProgram.toUpperCase()
        ) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', this.chosenProgram+ " already exist!")
          duplication = true
        }
      }
      if (!duplication) {
        if(noSpacesEnd === false && noSpacesStart === false) {
          try {
            const res = await api.put(`programs/${this.chosenProgramId}`, {
              program_name: this.chosenProgram,
              modified_by: this.userData.ind_id,
            })
            if (res) {
              flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Successfully updated program!")
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
            "Please remove extra spaces in the beginning or end of the program name"
          );
        }

        try {
          const res = await api.get(`programs/suborg/${this.chosenSubOrgId}`)
          if (res) {
            this.programList = res.data
          }
        } catch (error) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
        }
      }
      this.addClick++
      this.$emit('updateProgram', this.addClick)
    },

    clearAddField() {
      this.addProgramInput = ''
    },

    clearUpdatedField() {
      this.chosenProgram = ''
    },
  },
}
</script>

<style scoped>
.programBox {
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
