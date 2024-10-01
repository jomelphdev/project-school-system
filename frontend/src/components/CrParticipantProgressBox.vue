<script setup>
import DescriptionInline from './DescriptionInline.vue';
import DropDownInfo from './DropDownInfo.vue';
import DropDownInfoNumbered from './DropDownInfoNumbered.vue';
import HeaderReport from './HeaderReport.vue';
import FieldNameInline from './FieldNameInline.vue';
</script>

<template>
    <form @submit="handleSubmit">
        <HeaderReport label="Report previews and updates"></HeaderReport>
        
        <p>Coaches may preview individual reports once they become available, provided the participant has agreed to share report results. We recommend checking reports prior to coaching sessions to ensure completeness.
        <br>
        You can order the data in the table below by clicking on the headings, where relevant.
        </p>
        
        <div class="boxReports" style="display: flex; flex-direction: column; justify-content: space-between; flex-wrap: wrap;">
            <div>
                <FieldNameInline label="Participants: "></FieldNameInline>
                <span>1</span>
                <br>
                <FieldNameInline label="Participants registered: "></FieldNameInline>
                <span>1 (100.0%)</span>
                <br>
                <FieldNameInline label="Participants submitted: "></FieldNameInline>
                <span>1 (100.0%)</span>
                <br>
                <FieldNameInline label="Participants eligible for report: "></FieldNameInline>
                <span>1 (100.0%)</span>
                <br>
                <FieldNameInline label="Total nominees: "></FieldNameInline>
                <span>2</span>
                <br>
                <FieldNameInline label="Total nominees submitted: "></FieldNameInline>
                <span>2 (100.0%)</span>
                <br>
            </div>
        </div>
        <br>
        <div class="boxReports" style="display: flex; flex-direction: column; justify-content: space-between; flex-wrap: wrap;">
            <div>
                <table>
                    <tr>
                    <th>Participant</th><th>Email</th><th>Assessment</th><th>User signed in?</th><th></th><th>Current status</th><th>Deadline reminder</th><th>Coach report start date</th><th>Participant report start date</th><th>Group</th><th>Stream</th><th>Coach</th>
                    </tr>
                    <tr>
                    <td>Sample User</td><td>d**ha**et*@gma*l.**m</td><td>General Manager 360 Survey</td><td>Yes</td><td><a href="#">View 360 report</a></td><td>Report available</td><td></td><td></td><td></td><td>Sample Report</td><td>Sample Report</td>   <td>David Hallett (d.c.hallett@icloud.com)</td>
                    </tr>
                </table>
            </div>
        </div>
        <br>
        <div class="boxReports" style="display: flex; flex-direction: column; justify-content: space-between; flex-wrap: wrap;">
            <div>
                <FieldNameInline label="Not yet launched: "></FieldNameInline>
                <span>The assessment is in the system but has not been made available to the participant yet.</span>
                <br>
                <FieldNameInline label="Participants registered: "></FieldNameInline>
                <span>1 (100.0%)</span>
                <br>
                <FieldNameInline label="Participants submitted: "></FieldNameInline>
                <span>1 (100.0%)</span>
                <br>
                <FieldNameInline label="Participants eligible for report: "></FieldNameInline>
                <span>1 (100.0%)</span>
                <br>
                <FieldNameInline label="Total nominees: "></FieldNameInline>
                <span>2</span>
                <br>
                <FieldNameInline label="Total nominees submitted: "></FieldNameInline>
                <span>2 (100.0%)</span>
                <br>
            </div>
        </div>
    </form>
</template>

<script>
export default {
    name: 'CrParticipantProgressBox',
    component: [DescriptionInline, DropDownInfo, DropDownInfoNumbered,HeaderReport,FieldNameInline],
    props: ['buttonLabel'],
        
    data() {
        return {
            
            email: '',
            firstName: 'First name*',
            lastName: 'Last name*',
            phoneNumber: 'Phone number',
            timeZone: 'Select time-zone',
            organisation: 'Select organisation',
            roles: 'Roles',
            suppressEmail: false
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
</style>
