<docs>
This is a pre-built self-paced reading screen, with limited functionality, but simpler to use.

```vue
<Experiment>
    <SelfPacedReadingScreen
        :chunks="['This', 'is', 'a', 'nice', 'text.']"
        word-pos="next"
        underline="sentence" />

    <DebugResultsScreen />

</Experiment>
```

### With forced choice

```vue
<Experiment>

    <SelfPacedReadingScreen
        :chunks="['This', 'is', 'a', 'nice', 'text.']"
        word-pos="next"
        underline="sentence"
        :options="['Yes', 'bar']" />

    <DebugResultsScreen />

</Experiment>
```

### With rating task

```vue
<Experiment>

    <SelfPacedReadingScreen
        :chunks="['This', 'is', 'a', 'nice', 'text.']"
        word-pos="next"
        underline="sentence"
        question="Is this true?"
        option-left="improbable"
        option-right="Most likely" />

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
          chunks,
          wordPos,
          underline,
          qud,
          question,
          options,
          optionLeft,
          optionRight
        }"
      />
      <SelfPacedReading
        :chunks="chunks"
        :word-pos="wordPos"
        :underline="underline"
        :response-times.sync="$magpie.measurements.response_times"
      >
        <template #task>
          <p v-if="question" v-text="question"></p>
          <ForcedChoiceInput
            v-if="options.length"
            :options="options"
            :response.sync="$magpie.measurements.choice"
            @update:response="$magpie.saveAndNextScreen()"
          />
          <RatingInput
            v-else-if="optionLeft && optionRight"
            :right="optionRight"
            :left="optionLeft"
            :response.sync="$magpie.measurements.rating"
            @update:response="$magpie.saveAndNextScreen()"
          />
          <Wait v-else :time="1" @done="$magpie.saveAndNextScreen()" />
        </template>
      </SelfPacedReading>
    </Slide>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import SelfPacedReading from '..//tasks/SelfPacedReading';
import ForcedChoiceInput from '..//inputs/ForcedChoiceInput';
import RatingInput from '..//inputs/RatingInput';
import Wait from '..//helpers/Wait';
import Record from '..//helpers/Record';
import Slide from '../Slide';

export default {
  name: 'SelfPacedReadingScreen',
  components: {
    Slide,
    Record,
    Wait,
    RatingInput,
    ForcedChoiceInput,
    SelfPacedReading,
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
     * A question, presented after all chunks
     */
    question: {
      type: String,
      default: ''
    },
    /**
     * Forced choice options, presented after all chunks
     */
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    /**
     * Left label for rating, presented after chunks
     */
    optionLeft: {
      type: String,
      default: ''
    },
    /**
     * Right label for rating, presented after chunks
     */
    optionRight: {
      type: String,
      default: ''
    },
    /**
     * Self-paced reading text chunks
     */
    chunks: {
      type: Array,
      required: true
    },
    /**
     * Give instructions on what the participant is supposed to do
     */
    instructions: {
      type: String,
      default: 'Press SPACE to reveal the words.'
    },
    /**
     * The key to press to reveal the next word
     */
    trigger: {
      type: String,
      default: ' '
    },
    /**
     * Underline type
     *
     * @values words, sentence or none
     */
    underline: {
      type: String,
      default: 'none'
    },
    /**
     * Whether to show the next word at the same position or at the next
     *
     * @values same or next
     */
    wordPos: {
      type: String,
      default: 'same'
    }
  }
};
</script>
<style scoped></style>
