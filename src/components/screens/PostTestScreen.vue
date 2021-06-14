<docs>
This is a pre-built forced choice screen, with limited functionality, but simpler to use.

```vue
<Experiment>
    <PostTestScreen />

    <DebugResultsScreen />

</Experiment>
```
</docs>

<template>
  <Screen v-bind="$attrs" title="Additional information">
    <Slide>
      <p>
        Answering the following questions is optional, but your answers will
        help us analyze our results.
      </p>
      <div style="text-align: left; width: 200px; margin: 0 auto">
        <p v-if="age">
          <label
            >Age
            <input
              v-model="$magpie.measurements.age"
              type="number"
              max="110"
              min="18"
          /></label>
        </p>
        <p v-if="gender">
          <label
            >Gender
            <DropdownInput
              :options="['male', 'female', 'other']"
              :response.sync="$magpie.measurements.gender"
            />
          </label>
        </p>
        <p v-if="education">
          <label
            >Level of Eduction
            <DropdownInput
              :options="[
                'Graduated Highschool',
                'Graduated Collage',
                'Higher degree'
              ]"
              :response.sync="$magpie.measurements.education"
            />
          </label>
        </p>
        <p v-if="languages">
          <label
            >Native langauges
            <input
              v-model="$magpie.measurements.languages"
              type="text"
              placeholder="the langauge(s) spoken at home when you were a child"
          /></label>
        </p>
        <!-- @slot You can add additional questions here, storing data in measurements
           @binding {object} measurements a temporary object to store your responses before adding them to the results
           -->
        <slot :measurements="$magpie.measurements" />
        Further comments
        <TextareaInput
          :response.sync="$magpie.measurements.comments"
        ></TextareaInput>
      </div>

      <button @click="$magpie.saveAndNextScreen()">Next</button>
    </Slide>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import TextareaInput from '..//inputs/TextareaInput';
import DropdownInput from '..//inputs/DropdownInput';
import Slide from '../Slide';

export default {
  name: 'PostTestScreen',
  components: {
    Slide,
    DropdownInput,
    TextareaInput,
    Screen
  },
  props: {
    /**
     * Whether to ask for participant age
     */
    age: {
      type: Boolean,
      default: true
    },
    /**
     * Whether to ask for participant gender
     */
    gender: {
      type: Boolean,
      default: true
    },
    /**
     * Whether to ask for participant education
     */
    education: {
      type: Boolean,
      default: true
    },
    /**
     * Whether to ask for participant mother tongues
     */
    languages: {
      type: Boolean,
      default: true
    },
    /**
     * Whether to ask for comments
     */
    comments: {
      type: Boolean,
      default: true
    }
  }
};
</script>
<style scoped></style>
