<script setup>
import DescriptionInline from "./DescriptionInline.vue";
import Header from "./Header.vue";
import ButtonSubmit from "./ButtonSubmit.vue";
import ButtonCancel from "./ButtonCancel.vue";
import api from "../api/api";
import Multiselect from "@vueform/multiselect";
import { flashMessage } from "../functions.js";
</script>
<template>
  <section>
    <!-- Manage sub-organization Section -->
    <div class="subOrganizationBox">
      <Header label="Manage sub-organizations" />
      <div class="formBox">
        <div>
          <label for="subOrganization"
            ><DescriptionInline label="Sub-organization*"
          /></label>
          <input
            v-model="subOrganizationInput"
            id="subOrganization"
            class="formControl"
            required
          />
        </div>

        <div class="buttonBox">
          <ButtonSubmit
            label="Add"
            :disabled="!subOrganizationInput"
            @click.prevent="addSubOrg()"
          />
          <ButtonCancel
            label="Cancel"
            :disabled="!subOrganizationInput"
            @click.prevent="clearAddField()"
          />
        </div>
      </div>

      <div class="formBox">
        <div>
          <div class="textOnInput">
            <label for="selectSubOrganization"
              ><DescriptionInline label="Select sub-organization*"
            /></label>
            <select
              class="formControl"
              id="selectSubOrganization"
              name="subOrganization"
              v-model="chosenSubOrg"
              @change="selectSubOrg($event)"
              required
            >
              <option disabled>Select sub-organization</option>
              <option
                v-for="subOrganization in sortSubOrganizationList"
                :value="subOrganization.suborg_name"
                :key="subOrganization.suborg_id"
              >
                {{ subOrganization.suborg_name }}
              </option>
            </select>
          </div>
          <div class="textOnInput">
            <label for="subOrganization"
              ><DescriptionInline label="Sub-organization*"
            /></label>
            <input
              v-model.lazy="chosenSubOrg"
              id="subOrganization"
              class="formControl"
              required
              :disabled="!chosenSubOrg"
            />
          </div>
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
            :disabled="!chosenSubOrg"
          />
        </div>

        <div class="buttonBox">
          <ButtonSubmit
            label="Update"
            :disabled="!chosenSubOrg"
            @click="updateSubOrg()"
          />
          <ButtonCancel
            label="Cancel"
            :disabled="!chosenSubOrg"
            @click="clearUpdatedFields()"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ManageSubOrgBox",
  component: [
    DescriptionInline,
    Header,
    ButtonSubmit,
    ButtonCancel,
    Multiselect,
  ],
  props: ["userData", "brandData"],

  data: () => ({
    subOrgList: [],
    subOrganizationInput: "",
    subOrgId: "",
    chosenSubOrg: "",
    chosenSurveyTemplate: [],
    surveyTemplateList: [],
    surveyURL: "",
    fullSurveyTemplateList: [],
    surveyFilenameId: [],
    orgName: "",
    addClick: null,
  }),

  async mounted() {
    api
      .get(`sub-organizations/${this.userData.org_id}`)
      .then((response) => {
        this.subOrgList = response.data;
      })
      .catch((e) => {
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
      });
    try {
      const res = await api.get("survey-templates");
      if (res) {
        this.surveyTemplateList = res.data.map((data) => {
          return {
            value: data.survey_template_id,
            label: `${data.survey_template_name} - ${data.survey_description}`,
          };
        });
      }
    } catch (error) {
      flashMessage(
        this.$flashMessage,
        this.brandData.accent_color1 ? this.brandData.accent_color1 : "#F47820",
        this.brandData.flash_text_color
          ? this.brandData.flash_text_color
          : "#ffffff",
        error.message
      );
    }
    try {
      const res = await api.get("survey-templates");
      if (res) {
        this.fullSurveyTemplateList = res.data;
      }
      // console.log(this.fullSurveyTemplateList)
    } catch (error) {
      flashMessage(
        this.$flashMessage,
        this.brandData.accent_color1 ? this.brandData.accent_color1 : "#F47820",
        this.brandData.flash_text_color
          ? this.brandData.flash_text_color
          : "#ffffff",
        error.message
      );
    }
    try {
      const res = await api.get(`/organizations/${this.userData.org_id}`);
      if (res) {
        this.orgName = res.data.org_name;
      }
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    sortSubOrganizationList() {
      return this.subOrgList.sort((a, b) =>
        a.suborg_name.toUpperCase() < b.suborg_name.toUpperCase()
          ? -1
          : b.suborg_name.toUpperCase() > a.suborg_name.toUpperCase()
          ? 1
          : 0
      );
    },
    sortSurveyTemaplateList() {
      return this.surveyTemplateList.sort((a, b) =>
        a.label.toUpperCase() < b.label.toUpperCase()
          ? -1
          : b.label.toUpperCase() > a.label.toUpperCase()
          ? 1
          : 0
      );
    },
  },
  methods: {
    async getSuborg() {
      try {
        const res = await api.get(`sub-organizations/${this.userData.org_id}`);
        if (res) {
          this.subOrgList = res.data;
        }
      } catch (error) {
        flashMessage(
          this.$flashMessage,
          this.brandData.accent_color1
            ? this.brandData.accent_color1
            : "#F47820",
          this.brandData.flash_text_color
            ? this.brandData.flash_text_color
            : "#ffffff",
          error.message
        );
      }
    },
    async getSurveyTemplateAssociationByOrgIdAndSubrogId() {
      try {
        const res = await api.get(
          `survey-template-association/org/${this.userData.org_id}/suborg/${this.subOrgId}`
        );
        if (res) {
          this.chosenSurveyTemplate = res.data.map((data) => {
            return data.survey_template_id;
          });
        }
      } catch (error) {
        flashMessage(
          this.$flashMessage,
          this.brandData.accent_color1
            ? this.brandData.accent_color1
            : "#F47820",
          this.brandData.flash_text_color
            ? this.brandData.flash_text_color
            : "#ffffff",
          error.message
        );
      }
    },
    async addSubOrg() {
      let duplication = false;
      let latestSuborgId = "";
      for (const data of this.subOrgList) {
        if (
          data.suborg_name.toUpperCase() ===
          this.subOrganizationInput.toUpperCase()
        ) {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            this.subOrganizationInput + " already exist!"
          );
          duplication = true;
        }
      }
      if (!duplication) {
        try {
          const res = await api.post("sub-organizations", {
            suborg_name: this.subOrganizationInput.trim(),
            org_id: this.userData.org_id,
            created_by: this.userData.ind_id,
            modified_by: this.userData.ind_id,
          });
          if (res) {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color
                ? this.brandData.flash_text_color
                : "#ffffff",
              "Successfully Added sub-organization!"
            );
            this.getSuborg();
          }
        } catch (error) {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            error.message
          );
        }

        try {
          const res = await api.get("sub-organizations/latest");
          if (res) {
            for (const data of res.data) {
              latestSuborgId = data.latest_suborg_id;
            }
          }
        } catch (error) {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            error.message
          );
        }

        try {
          const res = await api.post("brands", {
            brand_name: `${this.orgName}:${this.subOrganizationInput}`,
            font: this.brandData.font,
            font_title_size: this.brandData.font_title_size,
            font_text_size: this.brandData.font_text_size,
            main_color1: this.brandData.main_color1,
            main_color2: this.brandData.main_color2,
            main_color3: this.brandData.main_color3,
            accent_color1: this.brandData.accent_color1,
            website_url: this.brandData.website_url,
            website_sender_email: this.brandData.website_sender_email,
            website_contact_email: this.brandData.website_contact_email,
            website_terms_url: this.brandData.website_terms_url,
            website_privacy_url: this.brandData.website_privacy_url,
            max_search_results: this.brandData.max_search_results,
            flash_text_color: this.brandData.flash_text_color,
            button_text_color: this.brandData.button_text_color,
            header_bg_color: this.brandData.header_bg_color,
            header_text_color: this.brandData.header_text_color,
            header_text_size: this.brandData.header_text_size,
            footer_bg_color: this.brandData.footer_bg_color,
            footer_text_color: this.brandData.footer_text_color,
            footer_text_size: this.brandData.footer_text_size,
            font_title_color: this.brandData.font_title_color,
            font_text_color: this.brandData.font_text_color,
            org_id: this.userData.org_id,
            suborg_id: latestSuborgId,
            created_by: this.userData.ind_id,
            modified_by: this.userData.ind_id,
          });
          if (res) {
            this.getSuborg();
          }
        } catch (error) {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            error.message
          );
        }
      }
      this.addClick++
      this.$emit('addedSuborg', this.addClick)
    },

    selectSubOrg(e) {
      let chosenSubOrg = e.target.value;
      for (const data of this.subOrgList) {
        if (data.suborg_name === chosenSubOrg) {
          this.subOrgId = data.suborg_id;
          break;
        }
      }
      this.getSurveyTemplateAssociationByOrgIdAndSubrogId();
    },
    selectSurvey(e) {
      console.log(e);
    },
    async updateSubOrg() {
      let duplication = false;
      let noSpacesEnd = this.chosenSubOrg.endsWith(' ')
      let noSpacesStart = this.chosenSubOrg.startsWith(' ')
      for (const data of this.subOrgList) {
        if (
          data.suborg_name.toUpperCase() === this.chosenSubOrg.toUpperCase() &&
          data.suborg_id !== this.subOrgId
        ) {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            this.chosenSubOrg + " already exist!"
          );
          duplication = true;
        }
      }
      if (!duplication && this.chosenSubOrg.length) {
        if(noSpacesEnd === false && noSpacesStart === false){
          try {
            const res = await api.put(`sub-organizations/${this.subOrgId}`, {
              suborg_name: this.chosenSubOrg.trim(),
              modified_by: this.userData.ind_id,
            });
            if (res) {
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                "Successfully updated sub-organization!"
              );
              this.getSuborg();
            }
          } catch (error) {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color
                ? this.brandData.flash_text_color
                : "#ffffff",
              error.message
            );
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
            "Please remove extra spaces in the beginning or end of the sub-organization name"
          );
        }

        try {
          const res = await api.delete(
            `survey-template-association/org/${this.userData.org_id}/suborg/${this.subOrgId}`
          );
          if (res) {
            const templateValues = Object.values(this.chosenSurveyTemplate);
            templateValues.forEach((data) => {
              for (const res of this.fullSurveyTemplateList) {
                if (res.survey_template_id === data) {
                  this.surveyFilenameId = res.survey_file;
                }
              }
              // console.log(this.surveyFilenameId)
              // api
              //   .get(
              //     `survey-template-association/org/${this.userData.org_id}/survey-template/${data}/suborg/0`
              //   )
              //   .then((res) => {
              //     this.surveyURL = res.data.map((data) => {
              //       return data.survey_url
              //     })
              try {
                const res = api.post("Survey-Template-Association", {
                  survey_template_association_name: "",
                  survey_template_id: data,
                  survey_template_link: `https://mnetdemo.gcm3.com/${this.surveyFilenameId}`,
                  org_id: this.userData.org_id,
                  suborg_id: this.subOrgId,
                  created_by: this.userData.ind_id,
                  modified_by: this.userData.ind_id,
                });
                if (res) {
                  this.getSurveyTemplateAssociationByOrgIdAndSubrogId();
                }
              } catch (error) {
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color
                    ? this.brandData.flash_text_color
                    : "#ffffff",
                  error.message
                );
              }
              // })
              // .catch((error) => {
              //   this.$flashMessage.show({
              //     type: 'error',
              //     title: error.message,
              //     message: '',
              //   })
              // })
            });
          }
        } catch (error) {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            error.message
          );
        }
      }
      this.addClick++
      this.$emit('updateSuborg', this.addClick)
    },
    clearAddField() {
      this.subOrganizationInput = "";
    },
    clearUpdatedFields() {
      this.subOrgId = "";
      this.chosenSubOrg = "";
      this.chosenSurveyTemplate = [];
    },
  },
};
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
.subOrganizationBox {
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
