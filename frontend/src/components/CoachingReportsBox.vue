<script setup>
import DescriptionInline from './DescriptionInline.vue';
import DropDownInfo from './DropDownInfo.vue';
import FileUploader from './FileUploader.vue';
</script>

<template>
    <form @submit="handleSubmit">
        <label style="color: #ccc;" for="selectOrganisation"><DescriptionInline label="Select organisation " /></label>
        <select  class="input" id="selectOrganisation" name="organization" v-model="organization">
            <option :value="null" disabled>Select Organisation</option>
            <option>MNET</option>
            <option>Talent Sage</option>
        </select>

        <label style="color: #ccc;" for="selectSubOrganisation"><DescriptionInline label="Select sub-organisation " /></label>
        <select class="input" id="selectSubOrganisation" name="sub_organization" v-model="sub_organization">
            <option disabled>Select sub-organization</option>
        </select>

        <label style="color: #ccc;" for="selectProgram"><DescriptionInline label="Select program " /></label>
        <select  class="input" id="selectProgram" name="program" v-model="program">
            <option :value="null" disabled>Select program</option>
            <option>Sample Report</option>
            <option>Sample Report2</option>
        </select>
        
        <label style="color: #ccc;" for="selectIteration"><DescriptionInline label="Select iteration " /></label>
        <select  class="input" id="selectIteration" name="iteration" v-model="iteration">
            <option :value="null" disabled>Select program</option>
            <option>Sample Report</option>
            <option>Sample Report2</option>
        </select>
        <br>
        <div class="boxReports" style="display: flex; flex-direction: column; justify-content: space-between; flex-wrap: wrap;">
            <div>
                <h4>General Manager 360 Survey - participant report</h4>
                <p>
                The participant progress report gives you a bird's eyve view of the status
                <br>
                Previews of participant reports are available as soon as there is enough
                <br>
                Additional submissions received during the preview period will be incorporated
                </p>
            </div>
            <div>
                <!--<button class="btnFit">Participant progress report</button>-->
                <button class="btnFit"><router-link to="/cr-participant-progress">Participant Progress Report</router-link></button>
            </div>
        </div>

        <br>
   

        <div class="boxReports" style="display: flex; flex-direction: column; justify-content: space-between; flex-wrap: wrap;">
            <div>
                <h4>General Manager 360 Survey - cohort reports</h4>
                <p>
                Cohort reports provide a consolidated view of each cohort's assessment
                
                </p>
            </div>
            <div>
                <!--<button class="btnFit">360 Cohort report</button>-->
                <button class="btnFit"><router-link to="/coaching-report-360">360 Cohort report</router-link></button>
            </div>
        </div>
        

        

    </form>
</template>

<script>
export default {
    name: 'CoachingReportsBox',
    component: [DescriptionInline, DropDownInfo, FileUploader],
    props: ['buttonLabel'],
        
    data() {
        return {
            organization: '',
            sub_organization: '',
            program: '',
            iteration: '',           
        }
    },
    
    methods: {
    
        onFileSubmit: function(file) {
            this.file = file;
            console.log(this.file);
            
        },

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
.btnFit {
    min-width: 40px;
    background-color: #e67829;
    color: white;
    border: 10px;
    padding: 10px 10px;
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
