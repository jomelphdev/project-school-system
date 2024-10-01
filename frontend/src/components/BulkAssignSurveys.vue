<script setup>
import Header from './Header.vue';
import Description from './Description.vue';
import BulkAssignSurveysBox from './BulkAssignSurveysBox.vue';


</script>

<template>
    <div class="body-container">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div>
            <Header label="Bulk assign surveys"></Header>
            <Description label="The values in the coachEmail column and all of the data columns are optional and can be assigned later."></Description>
            <p>Here's an example <a href="#">CSV file. </a></p>
            <BulkAssignSurveysBox
                    buttonLabel="Save"
            />
            </div>
        
            
        </div>
    </div>
</template>

<script>
export default {
    component: [BulkAssignSurveysBox, Header, Description],
    name: 'BulkAssignSurveys',
    data() {
        return {
        }
    }
}
</script>


<style scoped>

</style>