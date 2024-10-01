<script setup>
import ManageBrandBox from './ManageBrandBox.vue'
import Header from './Header.vue';
</script>

<template>
    <div class="body-container">
        <ManageBrandBox :userData="userData" />
    </div>
</template>

<script>
export default {
    name: 'ManageSurveys',
    component: [ManageBrandBox, Header],
    data: () => {

    },
    props: {
        userData: Object
    },
}
</script>