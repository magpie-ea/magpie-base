<docs>
```vue
<Experiment>
  <template #screens>
    <Screen>
      <template #0="{responses}">
        <p>Fries or soup?</p>
        <TextareaInput
            :response.sync="responses.lunch"
          />
        <p v-if="responses.lunch && responses.lunch > 3">I disagree!</p>
      </template>
    </Screen>
  </template>
</Experiment>
```
</docs>

<template>
  <div class="textarea">
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
  name: 'TextareaInput'
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
