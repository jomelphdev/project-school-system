<script setup>
import DescriptionInline from './DescriptionInline.vue';
import DropDownInfo from './DropDownInfo.vue';
import DropDownInfoNumbered from './DropDownInfoNumbered.vue';
import HeaderReport from './HeaderReport.vue';
import FieldNameInline from './FieldNameInline.vue';


</script>

<template>
    <form @submit="handleSubmit">
        <div  style="display: flex; flex-direction: column; justify-content: space-between; flex-wrap: wrap;">
        <label style="color: #ccc;" for="selectOrganisation"><DescriptionInline label="Select organisation " /></label>
        <select  class="input" id="selectOrganisation" name="organisation" v-model="org">
            <option :value="null" disabled>Select Organisation</option>
            <option>MNET</option>
            <option>Talent Sage</option>
        </select>

        <label style="color: #ccc;" for="selectSurveyTemplate"><DescriptionInline label="Select survey template " /></label>
        <select class="input" id="selectSurveyTemplate" name="survey_template" v-model="survey_template">
            <option disabled>Select survey template</option>
            <option>Talent Sage: Big 5 Survey</option>
            <option>Talent Sage: GM 360</option>
        </select>
      

        </div>   
        <input type="checkbox" id="checkbox" v-model="participant" />
        <label for="checkbox"><DescriptionInline label="Participant" /></label>
        <br>
        <br>
        <strong>{{survey_name}}</strong>
        <br>
        <br>
        <div class="list-item" v-bind:style="{backgroundColor: getStyle1}">
        The Subject of this survey is: {{ind_name}}
        </div>
        <p>
            * Mandatory fields are marked with an asterisk.
            </p>
        <div class="boxReports" style="display: flex; flex-direction: column; justify-content: space-between; flex-wrap: wrap;">
            <div>
                <p>
                    A 360 survey explores a person's impact on others from her/his colleague's point of view.  This type of survey gathers feedback about a person's leadership skills from a range of employees who know and work with the person.
<br>
<br>
The five leadership competencies used in this survey stem from those identified in leadership research and by executives as critical to leaders everywhere. Each competency is defined and contains a set of questions to help explore the specific leadership behaviours that reflect it. Three types of questions are found in the survey: multiple-choice, ranking and open-ended.
<br>
<br>
To complete the 360 survey, the subject of the survey completes two tasks: 1) invites feedback from a range of respondents (colleagues and/or stakeholders), and 2) completes the survey assessing her/himselft on the same survey. With views from every level and angle, including oneself, the results present a 360 view of the person's performance on these competencies.
<br>
<br>
Once invited to complete the survey by a person (the subject of the survey), you will be asked to rate how much you recognize the person's specific behaviour from your own experience. Simply rate how well the subject demonstrates each behaviour on the 5-point scale. If you have no evidence for a behaviour, select "No evidence/Don't know".
<br>
<br>
The survey should take approximately 20 - 25 minutes to complete.  However, you may do this at your own pace. The platform saves your responses as they are entered. You may edit them until submission. However, completing this sooner will keep the reminder emails out of your inbox.
<br>
<br>
 
                </p>    
                <FieldNameInline label="Confidentiality: "></FieldNameInline>
                <span>All responses (except for a primary supervisor's) will be sanitised during the processing of the data before being shared with the survey subject in accordance with our privacy policy.</span>
                
                <br>
            </div>
        </div>
    </form>
</template>

<script>
export default {
    name: 'SurveyPreviewBox',
    component: [DescriptionInline, DropDownInfo, DropDownInfoNumbered,HeaderReport,FieldNameInline],
    props: ['buttonLabel'],
        
    data() {
        return {
            org: '',
            survey_template: '',
            participant: false,
            survey_name: '360 Survey',
            ind_name: 'Greg Martin',
            subject_status: 'info'

        }
    },
    computed: {
        getStyle1() {
            if (this.subject_status == 'info') {
                return 'rgb(232, 244, 253)';
            }
            else if (this.subject_status == 'success') {
                return 'rgb(237, 247, 237)';
            }
            return 'rgb(232, 244, 253)';
        }    
    },

    
    methods: {
        handleSubmit(){
            console.log('submitted')
            console.log(this.email, this.firstName, this.suppressEmail)
        }
    }
}
</script>

<style scoped>


.input{
    width: 100%;
    outline: 0;
    border-width: 0 0 1px;
    border-color: grey;
    padding: 2px 5px;
    margin: 10px 0px;
    font-family: Arial, Helvetica, sans-serif;
}

.box {
    border: 1px solid #ccc;
    border-top: 4px solid rgb(185, 22, 10);
    text-align: center;
    font: -webkit-control;
    margin: 0 10px;
    min-height: 400px;
    padding: 10px;
    max-width: 250px;
    min-height: 620px;
}

.boxReports {
    border: 1px solid #ccc;
    border-top: 4px solid rgb(185, 22, 10);
    text-align: left;
    font: -webkit-control;
    margin: 0 10px;
    min-height: 10px;
    padding: 10px;
    max-width: 100%;
}
.btn {
    width: 100%;
    background-color: #e67829;
}

.label1{
    top: 0px;
    left: 0px;
    font-size: 18px;
    color: rgba(0,0,0, 0.54);
    font-family: Arial, Helvetica, sans-serif;
}


.input1{
    width: 100%;
outline: 0;
  border-width: 0 0 1px;
  border-color: grey;
   padding: 2px 5px;
    margin: 10px 0px;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
