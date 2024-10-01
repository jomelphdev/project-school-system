<script setup>
import ManageSurveysBox from './ManageSurveysBox.vue'
import Header from './Header.vue';
</script>

<template>
    <div class="body-container">
        <Header label="Manage Survey Template"></Header>
        <ManageSurveysBox :userData="userData" :brandData="brandData" />
    </div>
</template>

<script>
export default {
    name: 'ManageSurveys',
    component: [ManageSurveysBox, Header],
    data: () => {

    },
    props: {
        userData: Object,
        brandData: Object,
    },
}
</script>

<style scoped>
.description {
    font: -webkit-control;
}
</style>