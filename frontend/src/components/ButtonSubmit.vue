<template>
  <button class="btn-submit">{{ label }}</button>
</template>

<script>
export default {
  name: 'ButtonSubmit',
  props: {
    label: String,
  },
}
</script>

