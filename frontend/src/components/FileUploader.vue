<script setup>
</script>

<template>
  <div>
    <input
      style="display: none"
      type="file"
      ref="file"
      @change="handleChange"
    />
    <div
      class="box"
      @click="$refs.file.click()"
      style="
        border: 1px solid #ccc;
        background: #ddd;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <div id="file-name">{{fileName}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    onSubmit: Function,
    dynamicLabel: String,
  },
  created(){
    if(this.dynamicLabel !== undefined){
      this.fileName = this.dynamicLabel
    }
  },
  data: () => ({
    fileName: "Drag a file here, or upload one"
  }),
  methods: {
    handleChange: function (e) {
      this.onSubmit(e.target.files[0]);
        this.fileName = e.target.files[0].name;
    },
  },
  name: "FileUploader",
};
</script>

<style scoped>
.description {
  font: -webkit-control;
}
.box {
  min-width: 300px;
  min-height: 100px;
  border-radius: 3px;
  max-width: 60%;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>