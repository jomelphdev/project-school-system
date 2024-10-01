<script setup>
import Header from './Header.vue';
import Description from './Description.vue';
import MySurveysAdminBox from './MySurveysAdminBox.vue';

</script>
<template>
<Header label="My surveys (admin active surveys)"></Header>
        <Description label="Welcome to your personal development dashboard. Keep track of your progress and accell all your assigned taks from here."></Description>




<div>
  <input type="radio" v-model="surveyType" value="0">All surveys
  <input type="radio" v-model="surveyType" value="1">Incomplete surveys
  <input type="radio" v-model="surveyType" value="2">Surveys requiring nominations
  <input type="radio" v-model="surveyType" value="3">Completed Surveys
</div>
<br>


    <div style="display: flex; flex-direction: row; flex-wrap: wrap;">
        

        <div v-for="(survey, i) in surveys" :key="i">
            <MySurveysAdminBox :list="survey.list" :header="survey.header" />
        </div>
    </div>
</template>

<script>
export default {
    
    components: [MySurveysAdminBox, Header, Description],
    data() {
        return {
            surveyType: '',
            surveys: [

                {
                    header: 'Positive 360 Survey - Sales workshop',
                    list: [
                        {type: 'info', label: 'This survey was not submitted before the deadline'},
                        {type: 'info', label: 'Not enough nominees have submitted for you to be eligible for your report.'}
                    ],
                },

                {
                    header: 'General Manager 360 Survey - MNET',
                    list: [
                        {type: 'info', label: 'Survey Subject: Sample User'},
                        {type: 'success', label: 'You have successfully submitted this survey'}
                    ], 
                },
                
               {
                    header: 'Positive 360 Survey - Sanofi Positive 360 trial',
                    list: [
                        {type: 'info', label: 'Survey subject: JoElly (coach) Prouty Mclaren'},
                        {type: 'success', label: 'You have successfully submitted this survey'}
                    ],
                },
               {
                    header: 'General Manager 360 Survey - New Survey Test',
                    list: [
                        {type: 'info', label: 'Survey subject: JoEllyn (coach) Prouty Mclaren'},
                        {type: 'success', label: 'You have successfully submitted this survey'}
                    ],
                },
               {
                    header: 'Team Leader 360 Survey - TalentDOC workshop EJ',
                    list: [
                        {type: 'info', label: 'Survey subject: Etienne De Jager'},
                        {type: 'success', label: 'You have successfully submitted this survey'}
                    ],
                },
               {
                    header: 'Booth Executive Leadership Insight Profile - Booth test',
                    list: [
                        {type: 'info', label: 'Survey subject: Sample user'},
                        {type: 'info', label: 'This survey was not submitted before the deadline'}
                    ],
                }
                                                                
            ]
        }
    }
}
</script>

<style scoped>
input, select, option, textarea {
  border: 1px solid grey;
}
</style>