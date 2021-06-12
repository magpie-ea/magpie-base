<docs>
This is a pre-built completion screen, with limited functionality, but simpler to use.

```vue
<Experiment>
    <CompletionScreen
        question="What happened in antartica?"
        text="One %s fell over three %s."
        :options="[
              ['horse', 'penguin', 'bird'],
              ['icicles', 'trees', 'bushes']
              ]"
    />

    <DebugResultsScreen />
</Experiment>
```
</docs>

<template>
  <Screen v-bind="$attrs">
    <Slide>
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
        :response.sync="$magpie.measurements.completed_text"
        :responses.sync="$magpie.measurements.responses"
      />
      <button
        v-if="
          $magpie.measurements.responses &&
          $magpie.measurements.responses.filter(Boolean).length ===
            options.length
        "
        @click="$magpie.saveAndNextScreen()"
      >
        Next
      </button>
    </Slide>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import Slide from '../Screen';
import Record from '../helpers/Record';
import CompletionInput from '../inputs/CompletionInput';

export default {
  name: 'CompletionScreen',
  components: {
    CompletionInput,
    Record,
    Screen,
    Slide
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
