<script setup>
import Header from './Header.vue';
import Description from './Description.vue';
import ActiveSurveysBox from './ActiveSurveysBox.vue';


</script>

<template>
    <div class="body-container">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div>
            <Header label="Active Surveys"></Header>
            <Description label=" "></Description>
            <ActiveSurveysBox
                    buttonLabel="Find"
            />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    component: [ActiveSurveysBox, Header, Description],
    name: 'ActiveSurveys',
    data() {
        return {
        }
    }
}
</script>


<style scoped>

</style>