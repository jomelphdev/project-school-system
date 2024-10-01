<script setup>
import SurveyBox from './SurveyBox.vue';
</script>

<template>
    <div>
        <h1 style="text-align: center;">Home</h1>
        <div style="display: flex; justify-content: center; align-items: center;">
        <SurveyBox
                header="Coaching reports available" 
                data="5" 
                text="You have access to coaching reports" 
                buttonLabel="View"
                buttonColor="#e67829"
            /> 
        <SurveyBox
                header="Completed surveys" 
                data="8" 
                text="There are surveys you have previously completed." 
                buttonLabel="View"
                buttonColor="#e67829"
            />                   
        </div>
    </div>
</template>

<script>
export default {
    component: SurveyBox,
    name: 'HomeElevatedCoaches',
    data() {
        return {
        }
    }
}
</script>

<style scoped>

</style>

