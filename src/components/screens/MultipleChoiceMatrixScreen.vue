<docs>
This is a pre-built multiple choice matrix screen, with limited functionality, but easier to use.

```vue
<Experiment>

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
    <Slide>
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
        :responses.sync="$magpie.measurements.responses"
      />
      <button
        v-if="$magpie.measurements.responses && !validations.$error"
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
import MultipleChoiceMatrixInput from '../inputs/MultipleChoiceMatrixInput';
import Slide from '@/components/Slide';

export default {
  name: 'MultipleChoiceMatrixScreen',
  components: {
    Slide,
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
