<docs>
```vue
<Experiment>
  <template #screens>
    <Screen>
      <SliderInput
          question="Fries or soup?"
          left="Fries"
          right="Soup" />
    </Screen>
  </template>
</Experiment>
```
</docs>

<template>
  <div class="slider">
    <div class="question">{{ question }}</div>
    <div class="slider-element">
      <div class="left">{{ left }}</div>
      <Slider
        class="slider"
        :value="initial"
        :tooltip="tooltip ? 'always' : 'none'"
        @change="$emit('change:answer', $event)"
      />
      <div class="right">{{ right }}</div>
    </div>
  </div>
</template>

<script>
import Slider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

export default {
  /**
   * Have your participants answer on a continuous slider scale
   */
  name: 'SliderInput',
  components: { Slider },
  props: {
    /**
     * The question
     */
    question: {
      type: String,
      required: true
    },
    /**
     * Text left of the slider
     */
    left: {
      type: String,
      optional: true,
      default: ''
    },
    /**
     * Text right of the slider
     */
    right: {
      type: String,
      optional: true,
      default: ''
    },
    /**
     * Initial slider position
     */
    initial: {
      type: Number,
      optional: true,
      default: 0
    },
    /**
     * Whether to show the tooltip
     */
    tooltip: {
      type: Boolean,
      optional: true,
      default: false
    }
  }
};
</script>

<style scoped>
.slider-element {
  display: flex;
  margin: 20px 0;
}

.slider-element .left,
.slider-element .right {
  flex-grow: 0;
  padding: 0 20px;
}

.slider {
  flex-grow: 1;
}
</style>
