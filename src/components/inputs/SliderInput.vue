<template>
  <div class="slider">
    <div class="question">{{ question }}</div>
    <div class="slider-element">
      <div class="left">{{ left }}</div>
      <Slider class="slider" @change="$emit('change:answer', $event)" />
      <div class="right">{{ right }}</div>
    </div>
  </div>
</template>

<script>
import Slider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

export default {
  name: 'SliderInput',
  components: { Slider },
  props: {
    question: {
      type: String,
      required: true
    },
    left: {
      type: String,
      optional: true
    },
    right: {
      type: String,
      optional: true
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
