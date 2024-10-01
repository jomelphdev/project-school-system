<script setup>
import DescriptionInline from './DescriptionInline.vue'
import api from '../api/api'
import ButtonSubmit from './ButtonSubmit.vue'
import ButtonCancel from './ButtonCancel.vue'
import Multiselect from '@vueform/multiselect'
import {flashMessage} from "../functions.js";
</script>

<template>
  <section class="manageSuborgSection">
    <div class="formBox">
      <form>
        <label for="orgName" class="form-label"
          ><DescriptionInline label="Organization name*"
        /></label>
        <input
          type="text"
          id="orgName"
          class="formControl"
          name="orgName"
          v-model="orgName"
          required
        />
        <ButtonSubmit
          label="Add"
          :disabled="!orgName"
          @click.prevent="addOrg()"
        />
      </form>
    </div>

    <div class="formBox">
      <label for="selectOrg" class="form-label"
        ><DescriptionInline label="Select organization*"
      /></label>
      <select
        class="formControl"
        name="showAllOrg"
        id="selectOrg"
        v-model="chosenOrg"
        @change="selectOrg($event)"
      >
        <option disabled>Select Organisation</option>
        <option
          v-for="organization in sortOrganizationList"
          :value="organization.org_name"
          :key="organization.org_name"
        >
          {{ organization.org_name }}
        </option>
      </select>

      <label for="editOrgName"
        ><DescriptionInline label="Edit organization name*"
      /></label>
      <input
        type="text"
        class="formControl"
        name="updateOrgName"
        id="editOrgName"
        v-model.lazy="chosenOrg"
        :disabled="!chosenOrg"
      />

      <!-- <label for="brands" class="form-label"
        ><DescriptionInline label="Update brand"
      /></label>
      <select
        class="formControl"
        name="showAllBrand"
        id="brands"
        v-model="assignedBrandName"
        @change="selectBrand($event)"
        :disabled="!chosenOrg"
      >
        <option disabled>Select brand</option>
        <option value="0">(none)</option>
        <option
          v-for="brand in sortBrandList"
          :value="brand.brand_name"
          :key="brand.brand_id"
        >
          {{ brand.brand_name }}
        </option>
      </select> -->

      <label for="surveyTemplate" class="form-label"
        ><DescriptionInline label="Update survey template"
      /></label>
      <Multiselect
        class="formControl"
        v-model="chosenSurveyTemplate"
        @change="selectSurvey($event)"
        mode="tags"
        :close-on-select="false"
        :searchable="true"
        :options="sortSurveyTemaplateList"
        :disabled="!chosenOrg"
      />
      <div class="buttonBox">
        <ButtonSubmit
          label="Update"
          :disabled="!chosenOrg"
          @click="updateOrg()"
        />
        <ButtonCancel
          label="Cancel"
          :disabled="!chosenOrg"
          @click="clearInputField()"
        />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  components: [DescriptionInline, ButtonSubmit, ButtonCancel, Multiselect],
  props: ['userData','brandData'],

  data: () => ({
    orgName: '',
    orgList: [],
    brandList: [],
    chosenOrg: '',
    assignedBrandId: '',
    assignedBrandName: '',
    orgId: '',
    brandId: null,
    chosenSurveyTemplate: [],
    surveyTemplateList: [],
    surveyTemplateAssociationList: [],
    survey_url: '',
    fullSurveyTemplateList: [],
    surveyFilenameId: [],
  }),
  async mounted() {
    try {
      const res = await api.get('organizations')
      if (res) {
        this.orgList = res.data
      }
    } catch (error) {
      flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
    }

    try {
      const res = await api.get('brands')
      if (res) {
        this.brandList = res.data
      }
    } catch (error) {
      flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
    }

    try {
      const res = await api.get('survey-templates')
      if (res) {
        this.surveyTemplateList = res.data.map((data) => {
          return {
            value: data.survey_template_id,
            label: `${data.survey_template_name} - ${data.survey_description}`,
          }
        })
      }
    } catch (error) {
      flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
    }
    try {
      const res = await api.get('survey-templates')
      if (res) {
        this.fullSurveyTemplateList = res.data
      }
    } catch (error) {
      flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
    }
  },

  computed: {
    sortOrganizationList() {
      return this.orgList.sort((a, b) => (a.org_name.toUpperCase() < b.org_name.toUpperCase()) ? -1 : ((b.org_name.toUpperCase() > a.org_name.toUpperCase()) ? 1 : 0))
    },
    sortBrandList() {
      return this.brandList.sort((a, b) => (a.brand_name.toUpperCase() < b.brand_name.toUpperCase()) ? -1 : ((b.brand_name.toUpperCase() > a.brand_name.toUpperCase()) ? 1 : 0))
    },
    sortSurveyTemaplateList() { 
      return this.surveyTemplateList.sort((a, b) => (a.label.toUpperCase() < b.label.toUpperCase()) ? -1 : ((b.label.toUpperCase() > a.label.toUpperCase()) ? 1 : 0))
    }
  },

  methods: {
    async getOrganization() {
      try {
        const res = await api.get('organizations')
        if (res) {
          this.orgList = res.data
        }
      } catch (error) {
        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
      }
    },
    async getBrands() {
      try {
        const res = await api.get('brands')
        if (res) {
          this.brandList = res.data
        }
      } catch (error) {
        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
      }
    },
    async getSurveyTemplateAssociationByOrgId() {
      try {
        const res = await api.get(
          `survey-template-association/org/${this.orgId}`
        )
        if (res) {
          this.chosenSurveyTemplate = res.data.map((data) => {
            return data.survey_template_id
          })
        }
      } catch (error) {
        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
      }
    },
    selectOrg(e) {
      this.assignedBrandName = ''
      let chosenOrgResult = e.target.value
      for (const data of this.orgList) {
        if (data.org_name === chosenOrgResult) {
          this.orgId = data.org_id
          this.assignedBrandId = data.brand_id
        }
      }
      for (const data of this.brandList) {
        if (data.brand_id === this.assignedBrandId) {
          this.assignedBrandName = data.brand_name
        }
      }
      this.getSurveyTemplateAssociationByOrgId()
    },
    selectBrand(e) {
      let chosenBrandResult = e.target.value
      for (const data of this.brandList) {
        if (data.brand_name === chosenBrandResult) {
          this.brandId = data.brand_id
          break
        }
      }
      if (chosenBrandResult == 0) {
        this.brandId = 0
      }
    },
    selectSurvey(e) {
      console.log(e)
    },
    async addOrg() {
      let duplication = false
      let latestOrgId = ''
      for (const data of this.orgList) {
        if (data.org_name.toUpperCase() === this.orgName.toUpperCase()) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', this.orgName+ " already exist")
          duplication = true
        }
      }
      if (!duplication && this.orgName.length) {
        try {
          const res = await api.post('organizations', {
            org_name: this.orgName.trim(),
            created_by: this.userData.ind_id,
            modified_by: this.userData.ind_id,
          })
          if (res) {
            flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Successfully Added Organization!")
            this.getOrganization()
          }
        } catch (error) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
        }
        
        try {
          const res = await api.get('organizations/latest')
          if (res) {
            for (const data of res.data) {
              latestOrgId = data.latest_org_id
            }
          }
        } catch (error) {
            flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
        }

        try {
          const res = await api.post('brands', {
            brand_name: `${this.orgName} - Brand`,
            font: 'Arial',
            font_title_size: '27',
            font_text_size: '14',
            main_color1: 'Orange',
            main_color2: 'Teal',
            main_color3: 'Grey',
            accent_color1: 'Lime',
            logo_path: '/images/tsg',
            website_url: 'https://ts.talentsage.com/',
            website_sender_email: 'help@talentsage.com',
            website_contact_email: 'contact_us@talentsage.com',
            website_terms_url: 'https://ts.talentsage.com/terms.html',
            website_privacy_url: 'https://ts.talentsage.com/privacy.html',
            max_search_results: '25',
            org_id: latestOrgId,
            suborg_id: '0',
            created_by: this.userData.ind_id,
            modified_by: this.userData.ind_id,
          })
          if (res) {
            this.getBrands()
          }
        } catch (error) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
        }

        try {
          const res = await api.post('seed-tag', {
            org_id: latestOrgId
          })
          if (res) {
            console.log(res)
          }
        } catch (error) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
        }
      }
    },
    async updateOrg() {
      let duplication = false
      let noSpacesEnd = this.chosenOrg.endsWith(' ')
      let noSpacesStart = this.chosenOrg.startsWith(' ')
      for (const data of this.orgList) {
        if (
          data.org_name.toUpperCase() === this.chosenOrg.toUpperCase() &&
          data.org_id !== this.orgId
        ) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', this.chosenOrg+ " already exist!")
          duplication = true
        }
      }
      if (!duplication && this.chosenOrg.length) {
        if(noSpacesEnd === false && noSpacesStart === false){
          try {
            const res = await api.put(`organizations/${this.orgId}`, {
              org_name: this.chosenOrg.trim(),
              brand_id: this.brandId,
              modified_by: this.userData.ind_id,
            })
            if (res) {
              flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Successfully updated organization!")
              this.getOrganization()
              console.log(res)
            }
          } catch (error) {
            flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
          }
        }

        try {
          const res = await api.delete(
            `survey-template-association/org/${this.orgId}/suborg-id/0`
          )
          if (res) {
            console.log(res)
            const templateValues = Object.values(this.chosenSurveyTemplate)
            templateValues.forEach((data) => {
              // console.log(data)

              for (const res of this.fullSurveyTemplateList) {
                if (res.survey_template_id === data) {
                  this.surveyFilenameId = res.survey_file
                }
              }
                // console.log(this.surveyFilenameId)
              // api
              //   .get(
              //     `survey-template-association/org/${this.userData.org_id}/survey-template/${data}/suborg/0`
              //   )
              //   .then((res) => {
                  // this.surveyURL = res.data.map((data) => {
                  //   return data.survey_url
                  // })
                  // console.log(this.surveyURL)
                  // console.log(res)
                  try {
                    const res = api.post('Survey-Template-Association', {
                      survey_template_association_name: '',
                      survey_template_id: data,
                      survey_template_link: `https://mnetdemo.gcm3.com/${this.surveyFilenameId}`,
                      org_id: this.orgId,
                      suborg_id: '0',
                      created_by: this.userData.ind_id,
                      modified_by: this.userData.ind_id,
                    })
                    if (res) {
                      this.getSurveyTemplateAssociationByOrgId()
                    }
                  } catch (error) {
                    flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
                  }
                // })
                // .catch((error) => {
                //   this.$flashMessage.show({
                //     type: 'error',
                //     title: error.message,
                //     message: '',
                //   })
                // })
            })
          }
        } catch (error) {
          flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
        }
        this.getSurveyTemplateAssociationByOrgId()
      }
    },
    clearInputField() {
      this.orgId = ''
      this.chosenOrg = ''
      this.assignedBrandName = ''
      this.chosenSurveyTemplate = []
    },
  },
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
.manageSuborgSection {
  width: 100%;
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
