<docs>
This is a pre-built self-paced reading screen, with fewer options, but simpler to use.

```vue
<Experiment>
  <template #screens>

    <SelfPacedReadingScreen :chunks="['This', 'is', 'a', 'nice', 'text.']" word-pos="next" underline="sentence" />

    <DebugResultsScreen />

  </template>
</Experiment>
```

### With forced choice

```vue
<Experiment>
  <template #screens>

    <SelfPacedReadingScreen :chunks="['This', 'is', 'a', 'nice', 'text.']" word-pos="next" underline="sentence" :options="['Yes', 'bar']" />

    <DebugResultsScreen />

  </template>
</Experiment>
```

### With rating task

```vue
<Experiment>
  <template #screens>

    <SelfPacedReadingScreen
        :chunks="['This', 'is', 'a', 'nice', 'text.']"
        word-pos="next"
        underline="sentence"
        question="Is this true?"
        option-left="improbable"
        option-right="Most likely" />

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
        :response-times.sync="measurements.response_times"
      >
        <template #task>
          <p v-if="question" v-text="question"></p>
          <ForcedChoiceInput
            v-if="options.length"
            :options="options"
            :response.sync="measurements.choice"
            @update:response="saveAndNextScreen"
          />
          <RatingInput
            v-else-if="optionLeft && optionRight"
            :right="optionRight"
            :left="optionLeft"
            :response.sync="measurements.rating"
            @update:response="saveAndNextScreen"
          />
          <Wait v-else :time="1" @done="saveAndNextScreen" />
        </template>
      </SelfPacedReading>
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import SelfPacedReading from '@/components/tasks/SelfPacedReading';
import ForcedChoiceInput from '@/components/inputs/ForcedChoiceInput';
import RatingInput from '@/components/inputs/RatingInput';
import Wait from '@/components/helpers/Wait';

export default {
  name: 'SelfPacedReadingScreen',
  components: {
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
