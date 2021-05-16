<docs>
This is a pre-built categorization mouse tracking screen, with limited functionality, but simpler to use.

```vue
<Experiment>
  <template #screens>

    <CategorizationMousetrackingScreen
        option1="Right"
        option2="Left"
        stimulus="What is your strong hand?" />

    <DebugResultsScreen />

  </template>
</Experiment>
```
</docs>

<template>
  <Screen v-bind="$attrs">
    <template #0="{ measurements, saveAndNextScreen, save }">
      <p v-if="qud" v-text="qud"></p>
      <Record
        :data="{
          stimulus,
          qud,
          option1,
          option2
        }"
      />
      <CategorizationMousetracking
        :response.sync="measurements.option"
        :mouse-track.sync="measurements.mouseTrack"
      >
        <template #prep>
          <slot name="prep"></slot>
        </template>
        <template #option1>
          <slot name="option1">
            <div
              :style="{
                backgroundColor: 'lightgrey',
                width: '100px',
                padding: '70px'
              }"
            >
              {{ option1 }}
            </div>
          </slot>
        </template>
        <template #option2>
          <slot name="option2">
            <div
              :style="{
                backgroundColor: 'lightgrey',
                width: '100px',
                padding: '70px'
              }"
            >
              {{ option2 }}
            </div>
          </slot>
        </template>
        <template #stimulus>
          <slot name="stimulus">
            {{ stimulus }}
          </slot>
        </template>
        <template #feedback>
          <Record :data="{ ...measurements.mouseTrack }" />
          <Wait :time="1" @done="saveAndNextScreen" />
        </template>
      </CategorizationMousetracking>
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import Wait from '../helpers/Wait';
import Record from '../helpers/Record';
import CategorizationMousetracking from '@/components/tasks/CategorizationMousetracking';

export default {
  name: 'CategorizationMousetrackingScreen',
  components: {
    CategorizationMousetracking,
    Record,
    Wait,
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
     * Forced choice option left
     */
    option1: {
      type: String,
      default: ''
    },
    /**
     * Forced choice option right
     */
    option2: {
      type: String,
      default: ''
    },
    /**
     * The stimulus text
     */
    stimulus: {
      type: String,
      default: ''
    }
  }
};
</script>
<style scoped></style>
