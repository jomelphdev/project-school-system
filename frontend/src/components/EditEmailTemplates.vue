<script setup>
import EditEmailTemplatesBox from "./EditEmailTemplatesBox.vue";
import Header from "./Header.vue";
</script>

<template>
    <div class="body-container">
        <div>
            <Header label="Manage Templates"></Header>
            <Description label=""></Description>
            <EditEmailTemplatesBox :userData="userData" :brandData="brandData" />
        </div>
    </div>
</template>

<script>
export default {
    component: [EditEmailTemplatesBox, Header],
    name: "EditEmailTemplates",
    props: {
        userData: Object,
        brandData: Object,
    },
    data() {
        return {
        }
    }
};
</script>

<style scoped></style>
