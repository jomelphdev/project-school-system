<script setup>
import ManageSurveysCreateEditBox from './ManageSurveysCreateEditBox.vue'
</script>

<template>
    <div class="body-form-container">
        <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
            <ManageSurveysCreateEditBox :userData="userData" :brandData="brandData" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ManageSurveys',
    component: [ManageSurveysCreateEditBox],
    data: () => {

    },
    props: {
        userData: Object,
        brandData: Object,
    },
}
</script>