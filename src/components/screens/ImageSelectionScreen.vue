<docs>
This is a pre-built image selection screen, with limited functionality, but simpler to use.

```vue
<Experiment>
    <ImageSelectionScreen
        :options="[
                {src: 'img/fries.jpg', label: 'fries'},
                {src: 'img/soup.jpg', label: 'soup' }
                ]"
        question="What do you eat?"
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
          question,
          options: options.map((o) => o.label)
        }"
      />
      <p v-if="question" v-text="question"></p>
      <ImageSelectionInput
        :options="options"
        :response.sync="$magpie.measurements.image_choice"
        @update:response="$magpie.saveAndNextScreen()"
      />
    </Slide>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import Record from '..//helpers/Record';
import ImageSelectionInput from '..//inputs/ImageSelectionInput';
import Slide from '../Slide';

export default {
  name: 'ImageSelectionScreen',
  components: {
    Slide,
    ImageSelectionInput,
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
      default: ''
    },
    /**
     * Forced choice options. Each option must be an object looking as follows `{src: 'image path', label: 'my label'}`
     */
    options: {
      type: Array,
      required: true
    }
  }
};
</script>
<style scoped></style>
