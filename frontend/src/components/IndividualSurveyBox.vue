<script setup>
import DescriptionInline from './DescriptionInline.vue';
import DropDownInfo from './DropDownInfo.vue';
import DropDownInfoNumbered from './DropDownInfoNumbered.vue';
import HeaderReport from './HeaderReport.vue';
import FieldNameInline from './FieldNameInline.vue';
import DetailedBox from './DetailedBox.vue';


</script>

<template>
    <form @submit="handleSubmit">
        <div  style="display: flex; flex-direction: column; justify-content: space-between; flex-wrap: wrap;">
      
        </div>   
        
        <div class="list-item" v-bind:style="{backgroundColor: getStyle1}">
        {{survey_submission_message}}
        </div>

        <br>
        <div class="boxReports" style="display: flex; flex-direction: column; justify-content: space-between; flex-wrap: wrap;">
        
        
            <div>
                
                <FieldNameInline label="Deadline: "></FieldNameInline>
                <span>Mar 20, 2022, 12:00:00 AM GMT</span>
                <br>
                <FieldNameInline label="Status: "></FieldNameInline>
                <span>Submitted</span>
                <br>
      
                <br>
            </div>
        </div>
        <br>
        <div class="boxReports" style="display: flex; flex-direction: column; justify-content: space-between; flex-wrap: wrap;">
            <div>
                <HeaderReport label="You have shared your report with your coach"></HeaderReport>
          
            </div>
        </div>
        <br>
        <button class="btn">View 360 report</button>
        <br>
        <DropDownInfo label="Extended survey information" />
        <br>
        <HeaderReport label="Nominations made: 4/20"></HeaderReport>
        
        <div class="list-item" v-bind:style="{backgroundColor: getStyle2}">
        {{survey_nomination_message}}
        </div>

        <br>
        <HeaderReport label="Respondents: 2/4"></HeaderReport>
        <div class="list-item" v-bind:style="{backgroundColor: getStyle3}">
        {{survey_respondent_message}}
        </div>
        <DropDownInfo label="Show/hide nominations" />
        <button class="btn2">Status history</button>
        <button class="btn2">View progress</button>
        <button class="btn2">Edit</button>
        <button class="btn2">Delete</button>

    


    </form>
</template>

<script>

export default {
    name: 'IndividualSurveyBox',
    component: [DescriptionInline, DropDownInfo, DropDownInfoNumbered,HeaderReport,FieldNameInline, DetailedBox],
    props: {
        type: String,
        label: String,
    },


        
    data() {
        return {
            survey_submission_message: 'You have successfully submitted this survey',
            survey_submission_status: 'success',
            survey_nomination_message: 'Please make more nominations. We recommend at least: 7',
            survey_nomination_status: 'warning',
            survey_respondent_message: 'You have enough respondents to be eligible for a report',
            survey_respondent_status: 'success',


            

        }
    },

    computed: {
        getStyle1() {
            if (this.survey_submission_status == 'warning') {
                return 'rgb(255, 244, 229)';
            }
            else if (this.survey_submission_status == 'success') {
                return 'rgb(237, 247, 237)';
            }
            
        },
        getStyle2() {
            if (this.survey_nomination_status == 'warning') {
                return 'rgb(255, 244, 229)';
            }
            else if (this.survey_nomination_status == 'success') {
                return 'rgb(237, 247, 237)';
            }
            
        },
        getStyle3() {
            if (this.survey_respondent_status == 'warning') {
                return 'rgb(255, 244, 229)';
            }
            else if (this.survey_respondent_status == 'success') {
                return 'rgb(237, 247, 237)';
            }
            
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

.btn2 {
    width: auto;
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

.list-item {
    text-align: left;
    padding: 30px;
    margin: 8px 0;
}
</style>
