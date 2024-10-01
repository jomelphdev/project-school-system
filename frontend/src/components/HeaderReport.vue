<template>
    <h4 class="header">{{label}}</h4>
</template>

<script>
export default {
    props: {
        label: String,
    },
    name: 'HeaderReport',
}
</script>

<style scoped>
.header {
    font: -webkit-control;
    font-weight: bold;
}
</style>
