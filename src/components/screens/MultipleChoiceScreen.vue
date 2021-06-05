<docs>
This is a pre-built multiple choice screen, with limited functionality, but easier to use.

```vue
<Experiment>
  <template #screens>

    <MultipleChoiceScreen
        question="How was your breakfast?"
        :options="['Not enjoyable', 'Rather not enjoyable', 'OK', 'Rather enjoyable', 'Really enjoyable']"
    />

    <DebugResultsScreen />

  </template>
</Experiment>
```
</docs>

<template>
  <Screen v-bind="$attrs">
    <template #0="{ measurements, saveAndNextScreen }">
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
        :response.sync="measurements.response"
      />
      <button v-if="measurements.response" @click="saveAndNextScreen()">
        Submit
      </button>
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import Record from '../helpers/Record';
import MultipleChoiceInput from '@/components/inputs/MultipleChoiceInput';

export default {
  name: 'MultipleChoiceScreen',
  components: {
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
