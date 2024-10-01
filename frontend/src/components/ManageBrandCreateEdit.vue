<script setup>
import ManageBrandCreateEditBox from './ManageBrandCreateEditBox.vue'
</script>

<template>
    <div class="body-form-container">
        <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
            <ManageBrandCreateEditBox :userData="userData" :brandData="brandData"/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ManageBrand',
    component: [ManageBrandCreateEditBox],
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