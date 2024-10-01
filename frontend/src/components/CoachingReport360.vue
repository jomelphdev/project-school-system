<script setup>
import Header from './Header.vue';
import Description from './Description.vue';
import CoachingReport360Box from './CoachingReport360Box.vue';


</script>

<template>
    <div class="body-container">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div>
            <Header label="360 Leadership Feedback Report"></Header>
            
            <CoachingReport360Box
                    
            />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    component: [CoachingReport360Box, Header, Description],
    name: 'CoachingReport360',
    data() {
        return {
        }
    }
}
</script>


<style scoped>

</style>