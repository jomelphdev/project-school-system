<script setup>
import CreateEditUserBox from "./CreateEditUserBox.vue";
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    "
  >
    <CreateEditUserBox buttonLabel="Create User" :userData="userData" :brandData="brandData"/>
  </div>
</template>

<script>
export default {
  component: [CreateEditUserBox],
  name: "CreateEditUser",
  props: ['userData','brandData'],
  data: () => ({}),
  async mounted(){
  }
};
</script>

<style scoped></style>
