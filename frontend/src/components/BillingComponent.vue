<script setup>
import Header from './Header.vue';
import Description from './Description.vue';
import BillingBox from './BillingBox.vue';


</script>

<template>
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div>
        <Header label="Billing"></Header>
        <Description label=" "></Description>
        <BillingBox
                buttonLabel="Find"
        />
        </div>
    
        
    </div>
</template>

<script>
export default {
    component: [BillingBox, Header, Description],
    name: 'BillingComponent',
    data() {
        return {
        }
    }
}
</script>


<style scoped>

</style>