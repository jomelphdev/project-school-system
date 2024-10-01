<script setup>
import api from '../api/api'
import ButtonSubmit from './ButtonSubmit.vue'
import ButtonCancel from './ButtonCancel.vue'
import DescriptionInline from './DescriptionInline.vue';
import Header from './Header.vue';
import {flashMessage} from "../functions.js";
</script>

<template>
    <div class="reportTemplateSection">  

        <!-- add and update form -->
        <div>
            <Header v-if="status == 'add' " label="Create Report Template"></Header>
            <Header v-else label="Edit Report Template"></Header>
            <form class="formBox">

                <label><DescriptionInline label="Report name: " /></label>
                <input type="text" class="input" v-model="reportName"> 

                <label><DescriptionInline label="Report description: " /></label>
                <input type="text" class="input" v-model="reportDescription">

                <label><DescriptionInline label="Select survey template: " /></label>
                <select v-model="selectedSurveyTemplateID" class="input">
                    <option v-for="survey in surveyTemplateNameList" :key="survey.survey_template_id" :value="survey.survey_template_id" :selected="selectedSurveyTemplateID == survey.survey_template_id">
                        {{ survey.survey_template_name }}
                    </option>
                </select>

                <label><DescriptionInline label="Report Filename: " /></label>
                <input type="text" class="input" v-model="reportFileName">

                <label><DescriptionInline label="Select tag: " /></label>
                <select v-model="selectedTagType" class="input">
                    <option :value=null selected>Select tag</option>
                    <option v-for="(tag, index) in tagTypeList" :key="index" :value="tag" :selected="selectedTagType == tag" >{{ tag }}</option>
                </select>

                <label><DescriptionInline label="Coach Report: " /></label>
                <select class="input" v-model="isCoachReport">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                </select>

                <label><DescriptionInline label="Group Report: " /></label>
                <select class="input" v-model="isGroupReport">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                </select>

                <label><DescriptionInline label="Faculty Report: " /></label>
                <select class="input" v-model="isFacultyReport"> 
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                </select>

                <div>
                    <ButtonSubmit v-if="status == 'add' " @click.prevent="createNewReportTemplate" label="Add" />
                    <ButtonSubmit v-else @click.prevent="updateReportTemplate" label="Update" />  
                    <ButtonCancel @click.prevent="goToReport" label="Cancel"/>
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
        reportTemplateId: "",
        reportName: "",
        reportDescription: "",
        reportFileName: "",
        isCoachReport: 0,
        isGroupReport: 0,
        isFacultyReport: 0,

        surveyTemplateNameList: [],
        selectedSurveyTemplateID: '',

        tagTypeList: [
            "has_5_step",
            "has_tipping_point",
            "has_pressure_point",
            "has_coach_5_step",
            "has_coach_tipping_point",
            "has_coach_pressure_point",
            "has_coach_group_5_step",
            "has_coach_group_tipping_point",
            "has_coach_group_pressure_point",
        ],
        selectedTagType: null,
    }),
    mounted() {
        this.getSurveyTemplateName()

        this.passedDetails = JSON.parse(this.$route.params.data)
        this.status = this.passedDetails.status
        this.reportName = this.passedDetails.report_template_name
        this.reportDescription = this.passedDetails.report_description
        this.reportFileName = this.passedDetails.report_file
        this.selectedSurveyTemplateID = this.passedDetails.survey_template_id
        this.selectedTagType = this.passedDetails.tag_type
        this.reportTemplateId = this.passedDetails.report_template_id
        this.isCoachReport = this.passedDetails.is_coach_report
        this.isGroupReport = this.passedDetails.is_group_report
        this.isFacultyReport = this.passedDetails.is_faculty_report
    },
    methods: {
        formValidation() {
            if(this.reportName == '' || this.reportName == undefined) return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Report Name is required")
            else if(this.reportDescription == '' || this.reportDescription == undefined) return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Report Description is required")
            else if(this.selectedSurveyTemplateID == '' || this.selectedSurveyTemplateID == undefined) return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Please select a survey template")
            return true
        },
        goToReport() {
            this.$router.push("/manage_reports");
        },
        async getSurveyTemplateName() {
            api
                .get('survey-templates/survey-template-name')
                .then((res) => {
                    this.surveyTemplateNameList = res.data
                })
        },
        async createNewReportTemplate() {
            const valid = this.formValidation()
            if(valid) {
                // check report template name if already exist
                try {
                    const res = await api.get(`report-template-check-exist/${this.reportName}`)
                    if (res.data.status == 1) {
                        this.addReport()
                    }
                    else {
                        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', res.data.message)
                    }
                } catch (error) {
                    console.log('something went wrong');
                }
            }
        },
        async addReport() {
            const reportTemplateData = {
                "report_template_name": this.reportName,
                "report_description": this.reportDescription,
                "report_file": this.reportFileName,
                "survey_template_id": this.selectedSurveyTemplateID,
                "tag_type": this.selectedTagType,
                "is_coach_report": this.isCoachReport,
                "is_group_report": this.isGroupReport,
                "is_faculty_report": this.isFacultyReport,
                "created_by": this.userData.ind_id,
                "modified_by": this.userData.ind_id
            }

            try {
                const res = await api.post('report-template', reportTemplateData)
                if (res) {
                    flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "New report template has been added")
                    this.$router.push("/manage_reports");
                }
                else {
                    flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Please try again later or contact help@talentsage.com")
                }
            } catch (e) {
                console.log('something went wrong');
                flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', e.message)
            }
        },
        async updateReportTemplate() {
            const valid = this.formValidation()
            if(valid) {
                const reportTemplateData = {
                    "report_template_name": this.reportName,
                    "report_description": this.reportDescription,
                    "report_file": this.reportFileName,
                    "survey_template_id": this.selectedSurveyTemplateID,
                    "tag_type": this.selectedTagType,
                    "is_coach_report": this.isCoachReport,
                    "is_group_report": this.isGroupReport,
                    "is_faculty_report": this.isFacultyReport,
                    "modified_by": this.userData.ind_id
                }
                console.log(reportTemplateData)

                try {
                    const res = await api.put(`report-template/${this.reportTemplateId}`, reportTemplateData)
                    if (res) {
                        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Report template has been updated.")
                        this.$router.push("/manage_reports");
                    }
                    else {
                        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Something went wrong, Please try again later or contact help@talentsage.com")
                    }
                } catch (e) {
                    console.log('something went wrong');
                    flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', e.message)
                }
            }
        }
    },
    watch: {
        isCoachReport(value) {
            if(value == '1') {
                this.isFacultyReport = '0'
            }
        },  
        isGroupReport(value) {
            if(value == '1') {
                this.isCoachReport = '1'
                this.isFacultyReport = '0'
            }
        },  
        isFacultyReport(value) {
            if(value == '1') {
                this.isCoachReport = '0'
                this.isGroupReport = '0'
            }
        }
    }
}
</script>

<style scoped>
.reportTemplateSection {
  width: 50vw;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
