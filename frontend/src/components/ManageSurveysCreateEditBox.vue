<script setup>
import api from '../api/api'
import ButtonSubmit from './ButtonSubmit.vue'
import ButtonCancel from './ButtonCancel.vue'
import DescriptionInline from './DescriptionInline.vue';
import Header from './Header.vue';
import {flashMessage} from "../functions.js";
</script>

<template>
    <div class="surveyTemplateSection">  

        <!-- add and update form -->
        <div>
            <Header v-if="status == 'add' " label="Create Survey Template"></Header>
            <Header v-else label="Edit Survey Template"></Header>
            <form class="formBox">

                <label><DescriptionInline label="Survey Name: " /></label>
                <input type="text" class="input" v-model="surveyName"> 

                <label><DescriptionInline label="Survey Description: " /></label>
                <input type="text" class="input" v-model="surveyDescription">

                <label><DescriptionInline label="Survey Type: " /></label>

                <select v-if="status == 'add'" class="input mb-3" v-model="surveyType">
                    <option disabled>Select Survey Type</option>
                    <option value="1">Self assessment</option>
                    <option value="3">Research Confirmation</option>
                    <option value="4">Q-sort</option>
                    <option value="5">Values Fit Profile</option>

                </select>

                <input v-if="status == 'update'" type="text" readonly class="input" v-model="surveyType">

                <div>
                    <ButtonSubmit v-if="status == 'add' " @click.prevent="addSurveyTemplate" label="Add" />
                    <ButtonSubmit v-else @click.prevent="updateSurveyTemplate" label="Update" />
                    <ButtonCancel @click.prevent="goToSurvey" label="Cancel"/>
                </div>
            </form>
        </div>

    </div>
</template>

<script>
export default {
    components: [ButtonSubmit, ButtonCancel, DescriptionInline, Header],
    props: ['userData','brandData'],
    data: () => ({
        passedDetails: [],
        status: '',
        
        surveyTemplateId:'',
        surveyName: '',
        surveyDescription: '',
        surveyFile: '',
        surveyType: '',
        surveyVersion: 0
    }),
    mounted() {
        this.passedDetails = JSON.parse(this.$route.params.data)
        this.status = this.passedDetails.status
        this.surveyTemplateId = this.passedDetails.survey_template_id
        this.surveyName = this.passedDetails.survey_template_name
        this.surveyDescription = this.passedDetails.survey_template_description
        this.surveyFile = this.passedDetails.survey_template_file
        this.surveyType = this.passedDetails.survey_template_type
        this.surveyType = this.surveyType == 1 ? 'Self assessment' 
        : this.surveyType == 2 ? '360 nominations' 
        : this.surveyType == 3 ?'Research confirmation'
        : this.surveyType == 4 ? 'Q-sort'
        : this.surveyType == 5 ? 'Values Fit Profile'
        : ""
    },
    methods: {
        async addSurveyTemplate() {
            const valid = this.formValidation()

            let survey_file_name = `${this.surveyName}.html`
            // process the add function
            if(valid) {
                try {
                    const result = await api.get(`survey-template-check-exist/${this.surveyName}`)
                    console.log(result)
                    if (result.data.status == 1) {
                        this.surveyVersion = 1

                        const data = {
                            survey_version: this.surveyVersion,
                            survey_template_name : this.surveyName,
                            survey_description : this.surveyDescription,
                            survey_file : survey_file_name,
                            survey_type : this.surveyType,
                            nominee_survey_template_id: 0,
                            prepopulate_data: "null",
                            created_by : this.userData.ind_id,
                            modified_by : this.userData.ind_id,
                        }

                    await api
                    .post('survey-templates', data)
                    .then((res) => {
                        console.log(res)
                        if (res.status >= 200 || res.status <= 299) {
                            flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "New Survey Template has been added")
                            this.$router.push("/manage_surveys");
                        }
                    })
                    .catch((e) => {
                        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', e.message)
                    })
                    }else {
                        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', result.data.message)
                    }
                } catch (error) {
                    console.log(error);
                }

                // console.log(data);
            }
        },


        async updateSurveyTemplate() {
            const valid = this.formValidation()
            // process the update function
            if (valid) {
                try {
                    this.surveyType = this.surveyType == 'Self assessment' ? 1 
                    : this.surveyType === '360 nominations' ? 2
                    : this.surveyType === 'Research confirmation' ? 3
                    : this.surveyType === 'Q-sort' ? 4
                    : this.surveyType === 'Values Fit Profile' ? 5
                    : ""
                    const data = {
                        survey_template_id: this.surveyTemplateId,
                        survey_template_name: this.surveyName,
                        survey_description: this.surveyDescription,
                        survey_file: this.surveyFile,
                        survey_type: this.surveyType,
                        modified_by : this.userData.ind_id,
                    }
                    const res = await api.put(`survey-templates/${this.surveyTemplateId}`, data)
                    if (res.status === 200) { 
                        console.log(res);
                        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Survey Template has been updated")
                        this.$router.push("/manage_surveys");
                    }
                } catch (error) {
                    flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', error.message)
                }
                
            }
        },
        formValidation() {
            if(this.surveyName == '' || this.surveyName == undefined) return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Survey Name is required")
            else if(this.surveyDescription == '' || this.surveyDescription == undefined) return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Survey Description is required")
            else if(this.surveyType == '' || this.surveyType == undefined) return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Survey Type is required")
            return true
        },
        goToSurvey() {
            this.$router.push("/manage_surveys");
        }
    }
}
</script>

<style scoped>
.surveyTemplateSection {
  width: 50vw;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
