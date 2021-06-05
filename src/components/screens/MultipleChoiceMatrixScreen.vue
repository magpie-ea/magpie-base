<docs>
This is a pre-built multiple choice matrix screen, with limited functionality, but easier to use.

```vue
<Experiment>
  <template #screens>

    <MultipleChoiceMatrixScreen
        :questions="[
              'How is the weather today?',
              'How was your breakfast today?',
              'How do you like your job?',
              'What is your opinion of television?',
              'What is your opinion of folk music?'
            ]"
        :options="['Not enjoyable', 'Rather not enjoyable', 'OK', 'Rather enjoyable', 'Really enjoyable']"
    />

    <DebugResultsScreen />

  </template>
</Experiment>
```
</docs>

<template>
  <Screen
    v-bind="$attrs"
    :validations="{
      responses: {
        allAnswered: (res) => {
          const v = res && res.filter(Boolean).length === questions.length;
          console.log(v);
          return v;
        }
      }
    }"
  >
    <template #0="{ measurements, saveAndNextScreen, validations }">
      <p v-if="qud" v-text="qud"></p>
      <Record
        :data="{
          qud,
          questions,
          options,
          randomize
        }"
      />
      <MultipleChoiceMatrixInput
        :options="options"
        :questions="questions"
        :randomize="randomize"
        :responses.sync="measurements.responses"
      />
      <button
        v-if="measurements.responses && !validations.$error"
        @click="saveAndNextScreen()"
      >
        Submit
      </button>
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import Record from '../helpers/Record';
import MultipleChoiceMatrixInput from '@/components/inputs/MultipleChoiceMatrixInput';

export default {
  name: 'MultipleChoiceMatrixScreen',
  components: {
    MultipleChoiceMatrixInput,
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
     * The questions to ask
     */
    questions: {
      type: Array,
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
     * Whether to shuffle questions
     */
    randomize: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { console };
  }
};
</script>
<style scoped></style>
