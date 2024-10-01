<script setup>
import DescriptionInline from './DescriptionInline.vue';
import DropDownInfo from './DropDownInfo.vue';
</script>

<template>
    <form @submit="handleSubmit">

        <label style="color: #ccc;" for="selectOrganisation"><DescriptionInline label="Select organisation " /></label>
        <select  class="input" id="selectOrganisation" name="organization" v-model="organisation">
            <option :value="null" disabled>Select Organisation</option>
            <option>MNET</option>
            <option>Talent Sage</option>
        </select>


        <br>
        <table>
            <tr>
            <th>Sub-organisation</th><th>Program</th><th>Iteration</th><th></th><th></th>
            </tr>
            <tr>
            <td>Trial Groups</td><td>TalentSage Trial</td><td>2021</td><td><a href="#">View surveys</a></td><td><a href="#">Go to iteration</a></td>
            </tr>
            <tr>
            <td>MMT Digital</td><td>Executive Leadership Development Programme</td><td>September 2021</td><td><a href="#">View surveys</a></td><td><a href="#">Go to iteration</a></td>
            </tr>
            <tr>
            <td>TalentSage Marketing Trials</td><td>Life Sciences</td><td>December 2021</td><td><a href="#">View surveys</a></td><td><a href="#">Go to iteration</a></td>
            </tr>
            <tr>
            <td>LBS Degree Education</td><td>Executive MBA</td><td>EMBA_2021 Winter 2021/22</td><td><a href="#">View surveys</a></td><td><a href="#">Go to iteration</a></td>
            </tr>
            <tr>
            <td>King's Business School</td><td>Leadership and Professional Development (Healthcare) - KHP</td><td>Leadership & Professional Development KHP 2021/22</td><td><a href="#">View surveys</a></td><td><a href="#">Go to iteration</a></td>
            </tr>
            <tr>
            <td>LBS Sloan Programme</td><td>Sloan 2022 Executive Leadership Course</td><td>Sloan 2022</td><td><a href="#">View surveys</a></td><td><a href="#">Go to iteration</a></td>
            </tr>
            
        </table>

        <br>
      
    </form>
</template>

<script>
export default {
    name: 'ActiveSurveysBox',
    component: [DescriptionInline, DropDownInfo],
    props: ['buttonLabel'],
        
    data() {
        return {
            
            organisation: ''
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
