<docs>
```vue
<Experiment>
  <template #screens>
    <Screen>
      <TextareaInput
          question="Fries or soup?" />
    </Screen>
  </template>
</Experiment>
```
</docs>

<template>
  <div class="textarea">
    <div class="question">{{ question }}</div>
    <textarea
      ref="text"
      @input="$emit('update:response', $refs.text.value)"
    ></textarea>
  </div>
</template>

<script>
/**
 * Have your participants provide a text answer
 */
export default {
  name: 'TextareaInput',
  props: {
    /**
     * The question
     */
    question: {
      type: String,
      required: false,
      default: ''
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
