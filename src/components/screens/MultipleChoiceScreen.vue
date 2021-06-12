<docs>
This is a pre-built multiple choice screen, with limited functionality, but easier to use.

```vue
<Experiment>
    <MultipleChoiceScreen
        question="How was your breakfast?"
        :options="['Not enjoyable', 'Rather not enjoyable', 'OK', 'Rather enjoyable', 'Really enjoyable']"
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
          orientation
        }"
      />
      <p v-if="question" v-text="question"></p>
      <MultipleChoiceInput
        :options="options"
        :orientation="orientation"
        :response.sync="$magpie.measurements.response"
      />
      <button
        v-if="$magpie.measurements.response"
        @click="$magpie.saveAndNextScreen()"
      >
        Submit
      </button>
    </Slide>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import Record from '../helpers/Record';
import MultipleChoiceInput from '../inputs/MultipleChoiceInput';
import Slide from '@/components/Slide';

/**
 * Have participants choose answer from multiple options
 */
export default {
  name: 'MultipleChoiceScreen',
  components: {
    Slide,
    MultipleChoiceInput,
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
     * The possible options to choose from
     */
    options: {
      type: Array,
      required: true
    },
    /**
     * Whether to display 'vertical' or 'horizontal'
     */
    orientation: {
      type: String,
      default: 'vertical'
    }
  }
};
</script>
<style scoped></style>
