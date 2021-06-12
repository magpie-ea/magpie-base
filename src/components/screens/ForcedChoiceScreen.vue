<docs>
This is a pre-built forced choice screen, with limited functionality, but simpler to use.

```vue
<Experiment>

    <ForcedChoiceScreen
        :options="['Yes', 'No']"
        question="Do you understand this question?"
        qud="Always do the opposite of what you are asked." />

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
          options
        }"
      />
      <img v-if="picture" :src="picture" />
      <p v-if="question" v-text="question"></p>
      <ForcedChoiceInput
        :options="options"
        :response.sync="$magpie.measurements.choice"
        @update:response="$magpie.saveAndNextScreen()"
      />
    </Slide>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import ForcedChoiceInput from '..//inputs/ForcedChoiceInput';
import Record from '..//helpers/Record';
import Slide from '@/components/Slide';

export default {
  name: 'ForcedChoiceScreen',
  components: {
    Slide,
    Record,
    ForcedChoiceInput,
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
      default: ''
    },
    /**
     * Forced choice options
     */
    options: {
      type: Array,
      required: true
    },
    /**
     * A picture stimulus (a path or link to a picture)
     */
    picture: {
      type: String,
      default: ''
    }
  }
};
</script>
<style scoped></style>
