<script setup>
import DescriptionInline from './DescriptionInline.vue';
import DropDownInfo from './DropDownInfo.vue';
</script>

<template>
    <form @submit="handleSubmit">
        <div  style="display: flex; flex-direction: column; justify-content: space-between; flex-wrap: wrap;">
            <label style="color: #ccc;" for="selectOrganisation"><DescriptionInline label="Select organisation " /></label>
            <select  class="input" id="selectOrganisation" name="organization" v-model="organization">
                <option :value="null" disabled>Select Organisation</option>
                <option>MNET</option>
                <option>Talent Sage</option>
            </select>
            <br>
            <label style="color: #ccc;" for="selectSubOrganisation"><DescriptionInline label="Select sub-organisation " /></label>
            <select class="input" id="selectSubOrganisation" name="sub_organization" v-model="sub_organization">
                <option disabled>Select sub-organization</option>
            </select>
            <br>
            <label style="color: #ccc;" for="selectProgram"><DescriptionInline label="Select program " /></label>
            <select  class="input" id="selectProgram" name="program" v-model="program">
                <option :value="null" disabled>Select program</option>
                <option>Sample Report</option>
                <option>Sample Report2</option>
            </select>
            <br>
            <label style="color: #ccc;" for="selectIteration"><DescriptionInline label="Select iteration " /></label>
            <select  class="input" id="selectIteration" name="iteration" v-model="iteration">
                <option :value="null" disabled>Select program</option>
                <option>Sample Report</option>
                <option>Sample Report2</option>
            </select>
        </div>
        <br>

        <br>
        <table>
            <tr>
            <th>Streams</th><th>Template</th><th>Tags</th><th>Total</th><th>Surveys Not Started</th><th>Surveys Started</th><th>Surveys Report</th><th>Deleted/Dropped Not Started</th><th>Deleted/dropped Started</th><th>Deleted/Dropped Report</th>
            </tr>
            <tr>
            <td>September</td><td>TalentSage: Group Dynamics Profile (Q_SORT_SURVEY1)</td><td>HAS_5_STEP</td><td>8</td><td>0</td><td>0</td><td>8</td><td>0</td><td>0</td><td>0</td>
            </tr>
            <tr>
            <td>September</td><td>TalentSage: Big 5 Survey (BIG5_SURVEY1)</td><td>HAS_TIPPING_POINT</td><td>8</td><td>0</td><td>0</td><td>8</td><td>0</td><td>0</td><td>0</td>
            </tr>
            
        </table>

        <br>
       
    </form>
</template>

<script>
export default {
    name: 'BillingBox',
    component: [DescriptionInline, DropDownInfo],
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

.input{
    width: 100%;
    outline: 0;
    border-width: 0 0 1px;
    border-color: grey;
    padding: 2px 5px;
    margin: 10px 0px;
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
