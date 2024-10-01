<script setup>
import Header from './Header.vue';
import Description from './Description.vue';
import SurveyPreviewBox from './SurveyPreviewBox.vue';


</script>

<template>
    <div class="body-container">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div>
            <Header label="Survey Preview"></Header>
            <Description label=""></Description>
            <SurveyPreviewBox 
            />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    component: [SurveyPreviewBox, Header, Description],
    name: 'SurveyPreview',
    data() {
        return {
        }
    }
}
</script>


<style scoped>

</style>