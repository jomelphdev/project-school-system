<script setup>
import ManageReportsBox from './ManageReportsBox.vue'
import Header from './Header.vue';
</script>

<template>
    <div class="body-container">
        <Header label="Manage Report Template"></Header>
        <ManageReportsBox :userData="userData" :brandData="brandData" />
    </div>
</template>

<script>
export default {
    name: 'ManageReports',
    component: [ManageReportsBox, Header],
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