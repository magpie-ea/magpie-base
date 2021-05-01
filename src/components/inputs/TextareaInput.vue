<docs>
```vue
<Experiment>
  <template #screens>

    <Screen>

      <template #0="{measurements}">
        <p>Fries or soup? Discuss.</p>
        <TextareaInput
            :response.sync="measurements.lunch"
          />
        <p v-if="measurements.lunch && measurements.lunch.length > 32">I disagree!</p>
        <button @click="$magpie.addTrialData(measurements); $magpie.nextScreen();">Submit</button>
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
