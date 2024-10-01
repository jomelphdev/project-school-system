<script setup>
import Header from './Header.vue';
import BulkUserUploadBox from './BulkUserUploadBox.vue';

</script>

<template>
    <div class="body-container">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; ">
            <div>
            <Header label="Bulk user upload"></Header>
            <p>Download this: <a href="/storage/userTemplates/bulk_user_upload.csv" download="bulk_user_upload.csv" target="_blank">CSV template.</a>  All columns are mandatory. In the roles column, when in doubt, use PARTICIPANT.</p>
            <BulkUserUploadBox
                    buttonLabel="Create"
                    :passedUserData="userData"
                    :brandData="brandData"
            />
            </div>
        
            
        </div>
    </div>
</template>

<script>
export default {
    component: [BulkUserUploadBox, Header],
    name: 'BulkUserUpload',
    props: ['userData','brandData'],
    mounted(){
    },
    data:() => ({
    })
}
</script>


<style scoped>

</style>