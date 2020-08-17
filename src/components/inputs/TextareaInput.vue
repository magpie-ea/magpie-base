<template>
  <div class="textarea">
    <div class="question">{{ question }}</div>
    <textarea @change="$emit('change:answer', $event)"></textarea>
  </div>
</template>

<script>
export default {
  name: 'ImageSelectionInput',
  props: {
    question: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped></style>
