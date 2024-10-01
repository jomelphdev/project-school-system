<template>
    <span class="description">{{label}}</span>
</template>

<script>
export default {
    props: {
        label: String,
    },
    name: 'DescriptionInline',
}
</script>

<style scoped>
.description {
    font: -webkit-control;
}
</style>