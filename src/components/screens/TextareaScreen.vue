<docs>
This is a pre-built image selection screen, with limited functionality, but simpler to use.

```vue
<Experiment>
  <template #screens>

    <TextareaScreen
        question="What do you usually eat?"
        qud="Eating healthy is good for you."
    />

    <DebugResultsScreen />

  </template>
</Experiment>
```
</docs>

<template>
  <Screen v-bind="$props">
    <template #0="{ measurements, saveAndNextScreen }">
      <p v-if="qud" v-text="qud"></p>
      <Record
        :data="{
          qud,
          question
        }"
      />
      <p v-if="question" v-text="question"></p>
      <TextareaInput :response.sync="measurements.response" />
      <button
        v-if="measurements.response && measurements.response.length >= minChars"
        @click="saveAndNextScreen"
      >
        Next
      </button>
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import Record from '@/components/helpers/Record';
import TextareaInput from '@/components/inputs/TextareaInput';

export default {
  name: 'TextareaScreen',
  components: {
    TextareaInput,
    Record,
    Screen
  },
  props: {
    /**
     * Question under discussion. Always visible on the screen
     */
    qud: {
      type: String,
      default: ''
    },
    /**
     * A question
     */
    question: {
      type: String,
      required: true
    },
    /**
     * Minimum number of characters required for submission
     */
    minChars: {
      type: Number,
      default: 10
    }
  }
};
</script>
<style scoped></style>
