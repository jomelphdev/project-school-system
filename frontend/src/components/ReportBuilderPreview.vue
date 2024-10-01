<script setup>
import Header from "./Header.vue";
</script>

<template>
  <div class="body-container">
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      "
    >
      <div>
        <Header label="Report Preview"></Header>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  component: [Header],
  name: "ReportBuilderPreview",
  props: ["userData", "brandData"],
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeUnmount() {},
  unmounted() {},
  data: () => ({}),
};
</script>


<style scoped>
.body-container {
  padding: 20px 20px 20px 20px;
  box-shadow: none;
}
</style>