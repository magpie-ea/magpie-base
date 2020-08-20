<template>
  <div class="textarea">
    <div class="question">{{ question }}</div>
    <textarea @change="$emit('change:answer', $event)"></textarea>
  </div>
</template>

<script>
export default {
  name: 'TextareaInput',
  props: {
    question: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
textarea {
  border: 2px solid #5187ba;
  border-radius: 10px;
  display: block;
  font-size: 16px;
  margin: 0 auto;
  outline: none;
  padding: 10px 20px;
}
</style>
