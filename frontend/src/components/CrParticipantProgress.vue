<script setup>
import Header from './Header.vue';
import Description from './Description.vue';
import CrParticipantProgressBox from './CrParticipantProgressBox.vue';


</script>

<template>
    <div class="body-container">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div>
                <Header label="Participant progress"></Header>
                <Description label="This progress report gives you: 1) a bird's eye view of the status of each of your participants' progress each report process, and 2) access to a preview of student report results, where relevant."></Description>
                <CrParticipantProgressBox/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    component: [CrParticipantProgressBox, Header, Description],
    name: 'CrParticipantProgressBox',
    data() {
        return {
        }
    }
}
</script>


<style scoped>

</style>