<script setup>
import Header from './Header.vue';
import Description from './Description.vue';
import ElevatedUsersBox from './ElevatedUsersBox.vue';


</script>

<template>
    <div class="body-container">
        <div 
        style= "display: flex;
        flex-direction: column; 
        justify-content: center; 
        align-items: center; 
        padding: 30px">
            <div>
            <Header label="Elevated users"></Header>
            <Description label=""></Description>
            <ElevatedUsersBox :brandData="brandData" :userData="userData"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    component: [ElevatedUsersBox, Header, Description],
    name: 'ElevatedUsers',
    props: {
        brandData: Object,
        userData: Object
    },
    data() {
        return {
        }
    },
    async mounted(){
    }
}
</script>


<style scoped>

</style>