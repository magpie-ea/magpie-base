<docs>
This is a built-in screen with 4 life cycle phases:

 * Pause
 * Fixation
 * Stimulus presentation
 * Response

The last three phases can be completely customized using the corresponding slots, as you can see below.

```vue
<Experiment>

  <InstructionScreen>
    Press the button to try this.
  </InstructionScreen>

  <LifecycleScreen :pauseTime="1000" :fixationTime="1000" :stimulusTime="100">

    <template #stimulus>
      <img src="img/fries.jpg" />
    </template>

    <template #task>
      How often is it still healthy to eat fast food?
      <SliderInput left="Once a year" right="Once a day" :response.sync="$magpie.measurements.slider_rating" />
      <button v-if="typeof $magpie.measurements.slider_rating !== undefined" @click="$magpie.saveAndNextScreen()">Next</button>
    </template>

  </LifecycleScreen>

  <DebugResultsScreen />
</Experiment>
```
</docs>

<template>
  <Screen v-bind="$attrs">
    <Slide v-if="pauseTime">
      <!-- Pause -->
      <p v-if="qud" v-text="qud"></p>
      <Wait key="pause-timer" :time="pauseTime" @done="$magpie.nextSlide()" />
    </Slide>
    <Slide v-if="fixationTime">
      <!-- Fixation point -->
      <p v-if="qud" v-text="qud"></p>
      <slot name="fixation">
        <FixationCross />
      </slot>
      <Wait
        v-if="fixationTime !== -1"
        key="fixation-timer"
        :time="fixationTime"
        @done="$magpie.nextSlide()"
      />
    </Slide>
    <Slide v-if="stimulusTime">
      <!-- Stimulus phase -->
      <p v-if="qud" v-text="qud"></p>
      <slot name="stimulus"></slot>
      <Wait
        v-if="stimulusTime !== -1"
        key="stimulus-timer"
        :time="stimulusTime"
        @done="$magpie.nextSlide()"
      />
    </Slide>
    <Slide>
      <!-- Response phase -->
      <p v-if="qud" v-text="qud"></p>
      <slot v-if="!stimulusTime" name="stimulus"></slot>
      <slot name="task"></slot>
      <Wait
        v-if="responseTime"
        :time="responseTime"
        @done="$magpie.nextSlide()"
      />
      <Record
        :data="{
          qud
        }"
      />
      <ResponseTimeStart />
    </Slide>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import Slide from '../Slide';
import FixationCross from '../stimuli/FixationCross';
import Wait from '../helpers/Wait';
import ResponseTimeStart from '../helpers/ResponseTimeStart';
import Record from '../helpers/Record';

export default {
  name: 'LifecycleScreen',
  components: {
    Record,
    ResponseTimeStart,
    Wait,
    FixationCross,
    Slide,
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
     * Duration of the pause phase, don't set this, to avoid the pause altogether
     */
    pauseTime: {
      type: Number,
      default: 0
    },
    /**
     * Duration of the fixation point phase, don't set this to avoid showing the fixation point altogether
     */
    fixationTime: {
      type: Number,
      default: 0
    },
    /**
     * Duration of the stimulus phase, don't set this to avoid hiding the stimulus altogether
     */
    stimulusTime: {
      type: Number,
      default: 0
    },
    /**
     * How long the response should be enabled, don't set this, to avoid the timeout altogether
     */
    responseTime: {
      type: Number,
      default: 0
    }
  }
};
</script>
<style scoped></style>
