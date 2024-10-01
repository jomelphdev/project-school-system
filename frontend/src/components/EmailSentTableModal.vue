<script setup>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
</script>

<template>
  <div class="box">
    <div class="modal-overlay" @click="$emit('close-modal')">

        <div class="modal" @click.stop>
          <ckeditor
            :editor="editor"
            v-model="email_body"
            id="editor"
          ></ckeditor>
        </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "EmailSentTableModal",
  props: ["emailBody"],
  components: [ClassicEditor],
  async mounted() {
    this.email_body = this.emailBody;
  },
  method: {
  },
  data: () => ({
    editor: ClassicEditor,
    email_body: "",
  }),
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
  z-index: 1;
}

.modal {
  text-align: center;
  background-color: white;
  margin-top: 5%;
  height: 100vh;
  width: 80%;
  padding-top: 30px;
  max-height: calc(100vh - 210px);
  overflow-y: auto;
}

button {
  background-color: #ac003e;
  width: 150px;
  height: 40px;
  color: white;
  font-size: 14px;
  border-radius: 16px;
  margin-top: 50px;
}

.box {
  align-self: center;
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0px 2px 10px -4px #000000;
}
</style>