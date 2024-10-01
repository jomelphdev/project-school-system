<script setup>
import ManageReportsCreateEditBox from './ManageReportsCreateEditBox.vue'
</script>

<template>
    <div class="body-form-container">
        <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
            <ManageReportsCreateEditBox :userData="userData" :brandData="brandData" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ManageReports',
    component: [ManageReportsCreateEditBox],
    data: () => {

    },
    props: {
        userData: Object,
        brandData: Object,
    },
}
</script>