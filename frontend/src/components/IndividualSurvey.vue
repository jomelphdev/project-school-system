<script setup>
import Header from './Header.vue';
import Description from './Description.vue';
import IndividualSurveyBox from './IndividualSurveyBox.vue';


</script>

<template>
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div>
        <Header label="Individual survey"></Header>
        <Description label=""></Description>
        <IndividualSurveyBox  
        />
        </div>
    
        
    </div>
</template>

<script>
export default {
    component: [IndividualSurveyBox, Header, Description],
    name: 'AdminDashboard',
////////////






    //////////
    data() {
        return {
        }
    }
}
</script>


<style scoped>

</style>