<docs>
This is a pre-built rating screen, with limited functionality, but simpler to use.

```vue
<Experiment>
    <RatingScreen
        question="How healthy do you usually eat?"
        qud="Eating healthy is good for you."
        option-left="Very healthy"
        option-right="Very unhealthy"
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
          optionLeft,
          optionRight
        }"
      />
      <p v-if="question" v-text="question"></p>
      <RatingInput
        :left="optionLeft"
        :right="optionRight"
        :response.sync="$magpie.measurements.response"
        @update:response="$magpie.saveAndNextScreen()"
      />
    </Slide>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import Record from '..//helpers/Record';
import RatingInput from '..//inputs/RatingInput';
import Slide from '../Slide';

export default {
  name: 'RatingScreen',
  components: {
    Slide,
    RatingInput,
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
     * Left label for rating
     */
    optionLeft: {
      type: String,
      default: ''
    },
    /**
     * Right label for rating
     */
    optionRight: {
      type: String,
      default: ''
    }
  }
};
</script>
<style scoped></style>
