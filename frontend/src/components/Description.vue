<template>
  <p class="description">{{ label }}</p>
</template>

<script>
export default {
  props: {
    label: String,
  },
  name: "DescriptionBlock",
};
</script>

<style scoped></style>
