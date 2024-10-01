<script setup>
import SurveyBox from './SurveyBox.vue';
</script>

<template>
    <div>
        <h1 style="text-align: center;">Home</h1>
        <div style="display: flex; justify-content: center; align-items: center;">
        <SurveyBox
                header="Coaching reports available" 
                data="3" 
                text="You have access to coaching reports" 
                buttonLabel="View"
                buttonColor="#e67829"
            /> 
        <SurveyBox
                header="Completed surveys" 
                data="6" 
                text="There are surveys you have previously completed." 
                buttonLabel="View"
                buttonColor="#e67829"
            />
            <SurveyBox
                header="Personal reports available" 
                data="1" 
                text="You have personal reports available to you." 
                buttonLabel="View"
                buttonColor="#e67829"
        />                        
        </div>
    </div>
</template>

<script>
export default {
    component: SurveyBox,
    name: 'HomeElevatedProgressViewers',
    data() {
        return {
        }
    }
}
</script>

<style scoped>

</style>

