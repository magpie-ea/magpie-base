<docs>
This is a pre-built rating screen, with limited functionality, but simpler to use.

```vue
<Experiment>
  <template #screens>

    <CompletionScreen
        question="What happened in antartica?"
        text="One %s fell over three %s."
        :options="[
              ['horse', 'penguin', 'bird'],
              ['icicles', 'trees', 'bushes']
              ]"
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
          question,
          options,
          text
        }"
      />
      <p v-if="question" v-text="question"></p>
      <CompletionInput
        :text="text"
        :options="options"
        :response.sync="measurements.completed_text"
        :responses.sync="measurements.responses"
      />
      <button
        v-if="
          measurements.responses &&
          measurements.responses.filter(Boolean).length === options.length
        "
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
import CompletionInput from '@/components/inputs/CompletionInput';

export default {
  name: 'CompletionScreen',
  components: {
    CompletionInput,
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
     * The text that is supposed to be completed. `%s` marks completions
     */
    text: {
      type: String,
      required: true
    },
    /**
     * An array of arrays with possible completions per `%s`
     */
    options: {
      type: Array,
      required: true
    }
  }
};
</script>
<style scoped></style>
