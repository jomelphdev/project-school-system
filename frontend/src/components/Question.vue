<script setup>
import Header from './Header.vue';
import Description from './Description.vue';
</script>

<template>
    <div style="border: 1px solid blue;">
        <Header :label=header></Header>
        <Description :label=description></Description>
        <Description :label=question></Description>
        <div v-for="(option, i) in options" :key=i>
            <input type="radio" name="advice" value=option.answer>{{option.answer}}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        header: String,
        description: String,
        question: String,
        options: Array,
    },
    name: 'Question',
}
</script>

<style scoped>
.header {
    font: -webkit-control;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>