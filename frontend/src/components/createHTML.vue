<script setup>
import DescriptionInline from './DescriptionInline.vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import ButtonSubmit from './ButtonSubmit.vue'
</script>

<template>
  <div class="body-form-container">
    <div style="display: flex; align-items: center; justify-content: center; flex-direction: column;">
      <div class="htmlEditor">
      <h3>Create HTML</h3>
      <div class="ceditor">
      <ckeditor :editor="editor" v-model="textInit" :config="editorConfig"></ckeditor>
      </div>
      <ButtonSubmit label="Create HTML" @click="handleClick()" />
      </div>
      <textarea class="display" v-model="textToHTML"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: "createHTML",
  component: [DescriptionInline, ButtonSubmit],
  data: () => ({
      editor: ClassicEditor,
      textInit: "",
      textToHTML: "",
  }),
  methods: {
    handleClick(){
      return this.textToHTML = this.textInit;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.display {
  margin-left: auto;
  margin-right: auto;
  width: 700px;
  height: 350px;
  margin-top: 10px;
  align-content: center;
}

.htmlEditor {
  width: 700px;
}

.ceditor {
  margin-bottom: 10px;
}

.title {
  text-align: center;
  font-weight: bold;
  margin-top: 2px;
}
</style>
