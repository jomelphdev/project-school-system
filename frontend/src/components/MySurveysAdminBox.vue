<script setup>
import DetailedBoxItem from './DetailedBoxItem.vue';
</script>

<template>
    <div class="box" style="display: flex; flex-direction: column; justify-content: space-between; flex-wrap: wrap;">
        
        <div>
            <h4>{{header}}</h4>
            <div v-for="(item, i) in list" :key="i">
                <DetailedBoxItem :type="item.type" :label="item.label" />
            </div>
        </div>
        <button class="btn">See more</button>
    </div>
</template>

<script>
export default {
    name: 'MySurveysAdminBox',
    components: [DetailedBoxItem],
    props: {
        header: String,
        list: Array,
    }
}
</script>

<style scoped>
.box {
    border: 1px solid #ccc;
    border-top: 4px solid rgb(185, 22, 10);
    text-align: center;
    font: -webkit-control;
    margin: 0 10px;
    min-height: 400px;
    padding: 10px;
    max-width: 250px;
    min-height: 620px;
}
.btn {
    width: 100%;
    background-color: #e67829;
}
</style>