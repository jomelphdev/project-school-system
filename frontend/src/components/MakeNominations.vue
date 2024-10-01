<script setup>
import MakeNominationsBox from "./MakeNominationsBox.vue";
</script>

<template>
    <div class="body-form-container">
        <MakeNominationsBox :userData="userData" :brandData="brandData"/>
    </div>
</template>

<script>
export default {
    component: [MakeNominationsBox],
    props: {
        userData: Object,
        brandData: Object,
    },
    data: () => ({
    }),
    
}
</script>

<style scoped>
</style>
