<docs>
This is a pre-built image selection screen, with limited functionality, but simpler to use.

```vue
<Experiment>

    <TextareaScreen
        question="What do you usually eat?"
        qud="Eating healthy is good for you."
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
          question
        }"
      />
      <p v-if="question" v-text="question"></p>
      <TextareaInput :response.sync="$magpie.measurements.response" />
      <button
        v-if="
          $magpie.measurements.response &&
          $magpie.measurements.response.length >= minChars
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
import Record from '..//helpers/Record';
import TextareaInput from '..//inputs/TextareaInput';
import Slide from '@/components/Slide';

export default {
  name: 'TextareaScreen',
  components: {
    Slide,
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
