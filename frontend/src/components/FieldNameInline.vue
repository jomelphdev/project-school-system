<template>
    <span class="description">{{label}}</span>
</template>

<script>
export default {
    props: {
        label: String,
    },
    name: 'FieldNameInline',
}
</script>

<style scoped>
.description {
    font: -webkit-control;
    font-weight: bold;
}
</style>