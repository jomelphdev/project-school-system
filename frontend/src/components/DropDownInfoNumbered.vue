<script setup>

</script>

<template>
<div class="dropdownmargins">
    <strong v-if="closed" class="bg-orange fg-peach" style="display: inline; padding: 6px; ">{{number}}</strong><div style="display: inline;" v-if="closed" class="shadowed drop-down-info" @click="expand()">{{label}}</div>
    <div v-else class="drop-down-info shadowed md-height" style="display: flex; flex-direction: row;" @click="expand()">
        <div class="bg-orange fg-peach" style="padding: 5px; margin: -5px 5px -5px -5px; display: flex; justify-content: center; align-items: center;">{{number}}</div>
        <div>{{label}}
            <br>
            {{description}}
        </div>
    </div>
</div>    
</template>

<script>
export default {
    name: 'DropDownInfoNumbered',
    components: [],
    props: {
        number: String,
        label: String,
        description: String,
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
.bg-orange {
    background-color: #e67829;
}
.fg-peach {
    color: #ddd;
}
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
.dropdownmargins{
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 20px;
}
</style>