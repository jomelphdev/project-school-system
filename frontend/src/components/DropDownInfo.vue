<script setup>

</script>

<template>
    <div v-if="closed" class="shadowed drop-down-info" @click="expand()">{{label}}</div>
    <div v-else class="drop-down-info shadowed md-height" @click="expand()">
        ...some text
    </div>
</template>

<script>
export default {
    name: 'DropDownInfo',
    components: [],
    props: {
        label: String
    },
    data() {
        return {
            closed: true,
        }
    },
    methods: {
        expand: function() {
            this.closed = !this.closed;
        }
    },
}
</script>

<style scoped>
.drop-down-info {
    width: 100%;
    min-height: 20px;
    margin: 10px 0;
    padding: 5px;
    color: #e67829;
    background-color: #ddd;
}
.shadowed {
     box-shadow: 0 1px 2px rgba(0,0,0,0.07), 
                0 2px 4px rgba(0,0,0,0.07), 
                0 4px 8px rgba(0,0,0,0.07), 
                0 8px 16px rgba(0,0,0,0.07),
                0 16px 32px rgba(0,0,0,0.07), 
                0 32px 64px rgba(0,0,0,0.07);
}
.md-height {
    min-height: 250px;
}
</style>