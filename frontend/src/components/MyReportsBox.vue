<template>
    <div class="box">
        <h2>{{reportName}}</h2>
        <h5>Created from survey:</h5>
        <h5>{{surveyName}}</h5>
        <h6>{{dateTime}}</h6>
        <br />
        
        <button class="btn" v-bind:style="{color: buttonColor}">{{buttonLabel}}</button>
    </div>
</template>

<script>
export default {
    name: 'MyReportsBox',
    props: {
        reportName: String,
        surveyName: String,
        dateTime: String,
        buttonLabel: String,
        buttonColor: String,
    }
}
</script>

<style scoped>
.box {
    border: 1px solid #ccc;
    border-top: 4px solid rgb(221, 166, 0);
    text-align: center;
    font: -webkit-control;
    margin: 0 10px;
}
.btn {
    width: 100%;
}
</style>