<script setup>
import DetailedBox from './DetailedBox.vue';
</script>

<template>
    <div class="body-container">
        <div style="display: flex; flex-direction: row; flex-wrap: wrap;">
            <Header label="Billing"></Header>
            <Description label="Use wildcards when uncertain, e.g. john*"></Description>
            <div v-for="(survey, i) in surveys" :key="i">
                <DetailedBox :list="survey.list" :header="survey.header" />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    components: [DetailedBox],
    data() {
        return {
            surveys: [
                {list: [
                        {type: 'info', label: 'Deadline: Apr 23, 2022, 12:00:00 AM CDT'},
                        {type: 'warning', label: 'You have not yet submitted this survey'},
                        {type: 'warning', label: 'Please make more nominations. We recommend at least: 7'},
                        {type: 'warning', label: 'Please nominate at least one primary supervisor'},
                        {type: 'info', label: 'Not enough nominees have submitted for you to be eligible for your report'}
                ], header: 'General Manager 360 Survey - MNET'},
                {
                    header: 'Big 5 Survet - MNET',
                    list: [
                        {type: 'info', label: 'Deadline: Apr 23, 2022, 12:00:00 AM CDT'},
                        {type: 'info', label: 'You have not yet submitted this survey'}
                    ],
                },
               {
                    header: 'Professional Development Navigator (PDN) - MNET',
                    list: [
                        {type: 'info', label: 'Deadline: May 30, 2022, 12:00:00 AM CDT'},
                        {type: 'warning', label: 'You have not yet submitted this survey'}
                    ],
                },
               {
                    header: 'Values Fit Profile - MNET',
                    list: [
                        {type: 'info', label: 'Deadline: May 30, 2022, 12:00:00 AM CDT'},
                        {type: 'info', label: 'You have not yet submitted this survey'}
                    ],
                },
               {
                    header: 'Board Effectiveness Profile - MNET',
                    list: [
                        {type: 'info', label: 'Deadline: May 30, 2022, 12:00:00 AM CDT'},
                        {type: 'info', label: 'You have not yet submitted this survey'}
                    ],
                },
               {
                    header: '360 Survey - MNET',
                    list: [
                        {type: 'success', label: 'You have successfully submitted this survey'},
                        {type: 'success', label: 'You have enough respondents to be eligible for a report'},
                        {type: 'info', label: 'You have shared your report with your coach'},
                    ],
                },
               {
                    header: 'Big 5 Survey - MNET',
                    list: [
                        {type: 'success', label: 'You have successfully submitted this survey'},
                        {type: 'info', label: 'You have shared your report with your coach'},
                    ],
                }                                                                             
            ]
        }
    }
}
</script>

<style scoped>
.description {
    font: -webkit-control;
}
</style>