<script setup>

</script>

<template>
    <div class="list-item" v-bind:style="{backgroundColor: getStyle}">
       {{label}}
    </div>
</template>

<script>
export default {
    name: 'DetailedBoxItem',
    props: {
        type: String,
        label: String,
    },
    computed: {
        getStyle() {
            if (this.type == 'warning') {
                return 'rgb(255, 244, 229)';
            }
            else if (this.type == 'success') {
                return 'rgb(237, 247, 237)';
            }
            return 'rgb(232, 244, 253)';
        }
    }
}
</script>

<style scoped>
.list-item {
    text-align: left;
    padding: 30px;
    margin: 8px 0;
}
</style>