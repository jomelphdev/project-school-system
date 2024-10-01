<template>
  <button class="btn-cancel">{{ label }}</button>
</template>

<script>
export default {
  name: "ButtonCancel",
  props: {
    label: String,
  },
};
</script>

